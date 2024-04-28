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
import Filters from '../../../script/domain/Filters';

type SampleData = {
  value: number[];
};

type UpdateCall = {
  config: GraphDrawConfig;
  data: TimestampedData<MicrobitAccelerometerData>[];
};

class KNNModelGraphController {
  private rotationX: Writable<number>;
  private rotationY: Writable<number>;
  private rotationZ: Writable<number>;
  private origin: Writable<{ x: number; y: number }>;
  private scale: Writable<number>;
  private graphDrawer: KNNModelGraphDrawer;
  private trainingData: Point3D[][][];
  private filters: Filters;
  private drawInterval;
  private redrawTrainingData = false; // Only draw training data when rotation/scale/origin changes
  private unsubscriber;

  public constructor(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    private trainingDataGetter: () => TrainingData,
    origin: { x: number; y: number },
    classId: string,
    axis?: Axes
  ) {
    this.filters = classifier.getFilters();
    this.trainingData = this.trainingDataToPoints();
    this.graphDrawer = new KNNModelGraphDrawer(svg, classId);
    this.rotationX = writable(3);
    this.rotationY = writable(0.5);
    this.rotationZ = writable(0);
    this.scale = writable(100);
    this.origin = writable(origin);

    const noOfPoints = this.trainingData
      .map(el => el.length)
      .reduce((prev, cur) => prev + cur);
    const updateRate = 50 + noOfPoints / 2;

    // To avoid redrawing data, only flag the training data to be drawn if any of these stores are altered
    this.unsubscriber = derived(
      [this.rotationX, this.rotationY, this.rotationZ, this.scale, this.origin],
      () => ({}), // We don't need to use the values to anything. We just do this instead of subscribing to each store individually
    ).subscribe(() => (this.redrawTrainingData = true));

    this.drawInterval = setInterval(() => {
      const controllerData = this.getControllerData();
      this.onUpdate(controllerData, axis);
    }, updateRate);
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
    clearTimeout(this.drawInterval);
    this.unsubscriber();
  }

  private trainingDataToPoints(): Point3D[][][] {
    const data = this.trainingDataGetter();
    return data.classes.map(clazz => this.classToPoints(clazz));
  }

  private classToPoints(clazz: { samples: SampleData[] }): Point3D[][] {
    return clazz.samples.map(sample => this.sampleToPoints(sample));
  }

  private sampleToPoints(sample: SampleData): Point3D[] {
    return [this.arrayToPoint(sample.value)];
  }

  private getControllerData() {
    const xRot = get(this.rotationX);
    const yRot = get(this.rotationY);
    const zRot = get(this.rotationZ);
    const scale = get(this.scale);
    const origin = get(this.origin);
    let liveData: TimestampedData<MicrobitAccelerometerData>[] = [];

    try {
      liveData = liveAccelerometerData.getBuffer().getSeries(1000, 10);
    } catch (error) {
      liveData = [];
    }
    // Given as input to the draw function
    return {
      config: {
        xRot: classifier.getFilters().count() === 3 ? xRot : Math.PI,
        yRot: classifier.getFilters().count() === 3 ? yRot : 0,
        zRot,
        origin,
        scale,
      } as GraphDrawConfig,
      data: liveData,
    };
  }

  // Called whenever any subscribed store is altered
  private onUpdate(draw: UpdateCall, axis?: Axes) {
    let data: TimestampedData<MicrobitAccelerometerData>[] = draw.data;

    const getLiveFilteredData = () => {
      switch (axis) {
        case Axes.X:
          return this.filters.compute(data.map(d => d.value.x));
        case Axes.Y:
          return this.filters.compute(data.map(d => d.value.y));
        case Axes.Z:
          return this.filters.compute(data.map(d => d.value.z));
        default:
          throw new Error("Shouldn't happen");
      }
    };

    const liveData = getLiveFilteredData();
    this.graphDrawer.drawLiveData(draw.config, this.arrayToPoint(liveData));

    if (this.redrawTrainingData) {
      const drawData: Point3D[][][] = [...this.trainingData];
      this.redrawTrainingData = false;
      this.graphDrawer.draw(draw.config, drawData);
    }
  }

  private arrayToPoint(numsIn: number[]): Point3D {
    const nums = [...numsIn]
    if (this.filters.count() === 2) {
      nums[2] = 0 // Set z-value to 0
    }

    let [x, y, z] = this.normalizeVector(nums);

    return { x, y, z };
  }

  private normalizeVector(nums: number[]): number[] {
    const magnitude = Math.sqrt(nums.reduce((prev, cur) => prev + Math.pow(cur, 2), 0));
    if (magnitude === 0) {
      throw new Error("Cannot normalize vector, magnitude is 0!")
    }
    return nums.map(el => el / magnitude)
  }
}
export default KNNModelGraphController;
