/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type TrainingData } from '../../../lib/domain/ModelTrainer';
import { type Writable, derived, get, writable } from 'svelte/store';
import KNNModelGraphDrawer, { type GraphDrawConfig } from './KNNModelGraphDrawer';
import {
  type MicrobitAccelerometerData,
  MicrobitAccelerometerDataVector,
} from '../../../lib/livedata/MicrobitAccelerometerData';
import { type TimestampedData } from '../../../lib/domain/LiveDataBuffer';
import Filters from '../../../lib/domain/Filters';
import StaticConfiguration from '../../../StaticConfiguration';
import { stores } from '../../../lib/stores/Stores';
import { FilterType } from '../../../lib/domain/FilterTypes';
import BaseVector from '../../../lib/domain/BaseVector';
import type { Point3D } from '../../../lib/utils/graphUtils';
import { knnCurrentPoint, knnTrainingDataPoints } from './KnnModelGraph';

type UpdateCall = {
  config: GraphDrawConfig;
};

/**
 * Controller for the KNNModelGraph. Handles the interaction between the graph and the user.
 *
 * Generally the controller will be instantiated, whenever the model is retrained or the user navigates to the KNNModelGraph.
 */
class KNNModelGraphController {
  private rotationX: Writable<number>;
  private rotationY: Writable<number>;
  private rotationZ: Writable<number>;
  private graphColors: string[];
  private origin: Writable<{ x: number; y: number }>;
  private scale: Writable<number>;
  private graphDrawer: KNNModelGraphDrawer;
  private filters: Filters;
  private redrawTrainingData = false; // Only draw training data when rotation/scale/origin changes
  private unsubscriber;
  private currentPointUnsubscriber;

  public constructor(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    origin: { x: number; y: number },
    classId: string,
    colors: string[],
  ) {
    this.filters = stores.getClassifier().getFilters();
    this.graphDrawer = new KNNModelGraphDrawer(svg, classId);
    this.rotationX = writable(3);
    this.rotationY = writable(0.5);
    this.rotationZ = writable(0);
    this.scale = writable(this.getDefaultScale());
    this.origin = writable(origin);
    this.graphColors = colors;

    // To avoid redrawing data, only flag the training data to be drawn if any of these stores are altered
    this.unsubscriber = derived(
      [this.rotationX, this.rotationY, this.rotationZ, this.scale, this.origin],
      () => ({}), // We don't need to use the values to anything. We just do this instead of subscribing to each store individually
    ).subscribe(() => (this.redrawTrainingData = true));

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
    // TODO: This is a hack to make the data fit inside the graph. The proper solution is to calculate the scale based on the data
    return this.filters.has(FilterType.ACC) || this.filters.has(FilterType.PEAKS)
      ? 18
      : 100;
  }

  public multiplyScale(amount: number) {
    this.scale.update(newScale => newScale * amount);
  }

  public destroy() {
    this.unsubscriber();
    this.currentPointUnsubscriber();
  }

  private getControllerData(): { config: GraphDrawConfig } {
    const classifier = stores.getClassifier();
    const xRot = get(this.rotationX);
    const yRot = get(this.rotationY);
    const zRot = get(this.rotationZ);
    const scale = get(this.scale);
    const origin = get(this.origin);

    // Given as input to the draw function
    return {
      config: {
        xRot: classifier.getFilters().count() === 3 ? xRot : Math.PI,
        yRot: classifier.getFilters().count() === 3 ? yRot : 0,
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
      const liveDataVec = get(knnCurrentPoint) ?? new BaseVector([0, 0, 0]);
      this.graphDrawer.drawLiveData(draw.config, {
        x: liveDataVec.getValue()[0],
        y: liveDataVec.getValue()[1],
        z: 0, // Unsupported for now
      });
    } catch (_ignored) {}

    if (this.redrawTrainingData) {
      this.redrawTrainingData = false; // Won't redraw next time until flag is set
      const groupedByIndex = this.getTrainingDataPoints();
      this.graphDrawer.draw(draw.config, groupedByIndex);
    }
  }

  private getTrainingDataPoints = () => {
    const trainingDataPointsFromTrainer = get(knnTrainingDataPoints);
    const groupedByClass = Object.groupBy(
      trainingDataPointsFromTrainer,
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
