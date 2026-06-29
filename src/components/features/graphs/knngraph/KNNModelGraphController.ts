/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type Writable, derived, get, writable } from 'svelte/store';
import KNNModelGraphDrawer, { type GraphDrawConfig } from './KNNModelGraphDrawer';
import { knnTrainingDataPoints } from '../../../../lib/stores/KNNStores';
import type { Point3D } from '../../../../lib/utils/graphUtils';
import BaseVector from '../../../../core/vector/BaseVector';
import { FilterType, type Filter } from '../../../../core/filter/Filter';
import { getControllers } from '../../../../backend/interface-adapter/MLMachine';
import type { LabelledPoint } from '../../../../core/model/KNN/LabelledPoint';
import type { AbstractState } from '../../../../backend/statemanagement/AbstractState';
import type { AbstractReadonlyState } from '../../../../backend/statemanagement/AbstractReadonlyState';
import ConsoleLogger from '../../../../core/logging/ConsoleLogger';

type UpdateCall = {
  config: GraphDrawConfig;
};

/**
 * Controller for the KNNModelGraph. Handles the interaction between the graph and the user.
 *
 * Generally the controller will be instantiated, whenever the model is retrained or the user navigates to the KNNModelGraph.
 */
class KNNModelGraphController {

  private log = new ConsoleLogger(KNNModelGraphController.name);

  private rotationX: Writable<number>;
  private rotationY: Writable<number>;
  private rotationZ: Writable<number>;
  private graphColors: string[];
  private origin: Writable<{ x: number; y: number }>;
  private scale: Writable<number>;
  private graphDrawer: KNNModelGraphDrawer;
  private filters: Filter[];
  private redrawTrainingData = false; // Only draw training data when rotation/scale/origin changes
  private unsubscriber;
  private currentPointUnsubscriber;
  private knnPoints: LabelledPoint[];

  public constructor(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    origin: { x: number; y: number },
    classId: string,
    colors: string[],
  ) {
    this.filters = getControllers().getFilterController().getFilters().get();
    this.graphDrawer = new KNNModelGraphDrawer(svg, classId);
    this.rotationX = writable(3);
    this.rotationY = writable(0.5);
    this.rotationZ = writable(0);
    this.scale = writable(this.getDefaultScale());
    this.origin = writable(origin);
    this.graphColors = colors;
    const modelTraining = getControllers().getClassifierController().getModelTraining()

    // To avoid redrawing data, only flag the training data to be drawn if any of these stores are altered
    this.unsubscriber = derived(
      [this.rotationX, this.rotationY, this.rotationZ, this.scale, this.origin, modelTraining],
      () => ({}), // We don't need to use the values to anything. We just do this instead of subscribing to each store individually
    ).subscribe(() => (this.redrawTrainingData = true));

    const knnCurrentPoint = getControllers().getKnnController().getKNNInput();
    this.knnPoints = getControllers().getKnnController().getKNNPoints();

    this.currentPointUnsubscriber = knnCurrentPoint.subscribe(() => {
      const controllerData = this.getControllerData();
      this.onUpdate(controllerData);
    });
  }

  public setOrigin(x: number, y: number) {
    this.origin.set({ x, y });
  }

  public addRotation(rotation: Point3D) {
    this.rotationX.update(oldRot => {
      return oldRot + rotation.x;
    });
    this.rotationY.update(oldRot => {
      return oldRot + rotation.y;
    });
    this.rotationZ.update(oldRot => {
      return oldRot + rotation.z;
    });
  }

  private getDefaultScale() {
    const hasAcc = getControllers().getFilterController().hasFilterType(FilterType.ACC);
    const hasPeaks = getControllers()
      .getFilterController()
      .hasFilterType(FilterType.PEAKS);
    // TODO: This is a hack to make the data fit inside the graph. The proper solution is to calculate the scale based on the data
    return hasAcc || hasPeaks ? 18 : 100;
  }

  public multiplyScale(amount: number) {
    this.scale.update(newScale => newScale * amount);
  }

  public destroy() {
    this.unsubscriber();
    this.currentPointUnsubscriber();
  }

  private getControllerData(): { config: GraphDrawConfig } {
    const filters = getControllers().getFilterController().getFilters().get();
    const xRot = get(this.rotationX);
    const yRot = get(this.rotationY);
    const zRot = get(this.rotationZ);
    const scale = get(this.scale);
    const origin = get(this.origin);

    // Given as input to the draw function
    return {
      config: {
        xRot: filters.length === 3 ? xRot : Math.PI,
        yRot: filters.length === 3 ? yRot : 0,
        zRot,
        origin,
        scale,
        colors: this.graphColors,
      },
    };
  }

  // Called whenever any subscribed store is altered
  private onUpdate(draw: UpdateCall) {
    try {
      // Some filters throw when no filters data is available

      const knnCurrentPoint = getControllers().getKnnController().getKNNInput();
      const liveDataVec = get(knnCurrentPoint) ?? new BaseVector([0, 0, 0]);
      this.graphDrawer.drawLiveData(draw.config, {
        x: liveDataVec.getValue()[0],
        y: liveDataVec.getValue()[1],
        z: 0, // Unsupported for now
      });
    } catch (_ignored) { }

    if (this.redrawTrainingData) {
      this.log.info('Redrawing training data');
      this.knnPoints = getControllers().getKnnController().getKNNPoints();
      this.redrawTrainingData = false; // Won't redraw next time until flag is set
      const groupedByIndex = this.getTrainingDataPoints();
      this.graphDrawer.draw(draw.config, groupedByIndex);
    }
  }

  private getTrainingDataPoints = () => {
    const groupedByClass = Object.groupBy(
      this.knnPoints,
      e => e.classIndex,
    );
    const groupedByIndex: Point3D[][] = [];
    for (const key in groupedByClass) {
      groupedByIndex.push(
        groupedByClass[key]!.map(e => {
          return {
            x: e.vector.getValue()[0],
            y: e.vector.getValue()[1],
            z: 0,
          } as Point3D;
        }),
      );
    }
    return groupedByIndex;
  };
}

export const controller = writable<KNNModelGraphController | undefined>(undefined);

export default KNNModelGraphController;
