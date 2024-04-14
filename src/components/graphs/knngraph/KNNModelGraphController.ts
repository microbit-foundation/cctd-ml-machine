/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import * as d3 from 'd3';
import { Point3D } from '../../../script/TypingUtils';
import { TrainingData } from '../../../script/domain/ModelTrainer';
import { Unsubscriber, Writable, derived, get, writable } from 'svelte/store';
import KNNModelGraphDrawer, { GraphDrawConfig } from './KNNModelGraphDrawer';
import { classifier, liveAccelerometerData } from '../../../script/stores/Stores';
import { MicrobitAccelerometerData } from '../../../script/livedata/MicrobitAccelerometerData';
import { TimestampedData } from '../../../script/domain/LiveDataBuffer';
import Axes from '../../../script/domain/Axes';
import PerformanceProfileTimer from '../../../script/utils/PerformanceProfileTimer';

type SampleData = {
  value: number[];
};

type UpdateCall = {
  config: GraphDrawConfig;
  data: TimestampedData<MicrobitAccelerometerData>[];
}

class KNNModelGraphController {
  private rotationX: Writable<number>;
  private rotationY: Writable<number>;
  private rotationZ: Writable<number>;
  private origin: Writable<{ x: number; y: number }>;
  private scale: Writable<number>;
  private unsubscribeDerived: Unsubscriber;
  private graphDrawer: KNNModelGraphDrawer;
  private trainingData: Point3D[][][];

  public constructor(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    private trainingDataGetter: () => TrainingData,
    origin: { x: number; y: number },
    classId: string,
    axis?: Axes,
  ) {
    this.trainingData = this.trainingDataToPoints();
    this.graphDrawer = new KNNModelGraphDrawer(svg, classId);
    this.rotationX = writable(3);
    this.rotationY = writable(0.5);
    this.rotationZ = writable(0);
    this.scale = writable(100);
    this.origin = writable(origin);

    // Derived store ensures if any of the inputs are updated, the draw call will be called again
    this.unsubscribeDerived = this.deriveControllerStore().subscribe(draw => this.onUpdate(draw, axis));
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

  public multiplyScale(amount: number) {
    this.scale.update(newScale => newScale * amount);
  }

  public destroy() {
    this.unsubscribeDerived();
  }

  private trainingDataToPoints(): Point3D[][][] {
    const data = this.trainingDataGetter();
    return data.classes.map(clazz => this.classToPoints(clazz));
  }

  private classToPoints(clazz: { samples: SampleData[] }): Point3D[][] {
    return clazz.samples.map(sample => this.sampleToPoints(sample));
  }

  private sampleToPoints(sample: SampleData): Point3D[] {
    return [{ x: sample.value[0], y: sample.value[1], z: sample.value[2] }];
  }

  private deriveControllerStore() {
    return derived(
      [
        this.rotationX,
        this.rotationY,
        this.rotationZ,
        this.scale,
        liveAccelerometerData,
        this.origin,
      ],
      stores => {
        const xRot = stores[0];
        const yRot = stores[1];
        const zRot = stores[2];
        const scale = stores[3];
        const origin = stores[5];
        let liveData: TimestampedData<MicrobitAccelerometerData>[] = [];

        try {
          liveData = liveAccelerometerData.getBuffer().getSeries(1000, 10);
        } catch (error) {
          liveData = [];
        }
        // Given as input to the draw function
        return {
          config: {
            xRot,
            yRot,
            zRot,
            origin,
            scale,
          } as GraphDrawConfig,
          data: liveData,
        };
      },
    )
  }

  // Called whenever any subscribed store is altered
  private onUpdate(draw: UpdateCall, axis?: Axes) {
    const data = draw.data;

    // Add live data
    const liveXs: number[] = [];
    const liveYs: number[] = [];
    const liveZs: number[] = [];
    data.forEach(d => {
      liveXs.push(d.value.x);
      liveYs.push(d.value.y);
      liveZs.push(d.value.z);
    });
    const filters = classifier.getFilters();
    const filteredXs = filters.compute(liveXs);
    const filteredYs = filters.compute(liveYs);
    const filteredZs = filters.compute(liveZs);

    const toPoint = (nums: number[]): Point3D => {
      return { x: nums[0], y: nums[1], z: nums[2] };
    };

    /* 
    const liveDataCombined = [
      [toPoint(filteredXs), toPoint(filteredYs), toPoint(filteredZs)],
    ];
*/
    const liveData = [
      [
        toPoint(
          axis === Axes.X ? filteredXs : axis === Axes.Y ? filteredYs : filteredZs,
        ),
      ],
    ];

    const drawData = [...this.trainingData];
    if (!filteredXs.includes(NaN)) {
      axis && drawData.push(liveData);
    }

    this.graphDrawer.draw(draw.config, drawData);
  }
}
export default KNNModelGraphController;
