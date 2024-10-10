/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { TrainingData } from '../../../script/domain/ModelTrainer';
import { Writable, derived, get, writable } from 'svelte/store';
import KNNModelGraphDrawer, { GraphDrawConfig } from './KNNModelGraphDrawer';
import {
  MicrobitAccelerometerData,
  MicrobitAccelerometerDataVector,
} from '../../../script/livedata/MicrobitAccelerometerData';
import { TimestampedData } from '../../../script/domain/LiveDataBuffer';
import Axes from '../../../script/domain/Axes';
import Filters from '../../../script/domain/Filters';
import { Point3D } from '../../../script/utils/graphUtils';
import StaticConfiguration from '../../../StaticConfiguration';
import { stores } from '../../../script/stores/Stores';
import { FilterType } from '../../../script/domain/FilterTypes';

type SampleData = {
  value: number[];
};

type UpdateCall = {
  config: GraphDrawConfig;
  data: TimestampedData<MicrobitAccelerometerDataVector>[];
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
  private trainingData: Point3D[][][];
  private filters: Filters;
  private drawInterval;
  private redrawTrainingData = false; // Only draw training data when rotation/scale/origin changes
  private unsubscriber;
  private liveDataRecordsSize = 3;
  private liveDataRecords: TimestampedData<MicrobitAccelerometerDataVector>[][] = []; // Used to 'smoothe' live data point. Expected to contain a few points(liveDataRecordsSize), and points are replaced at each update

  public constructor(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    private trainingDataGetter: () => TrainingData,
    origin: { x: number; y: number },
    classId: string,
    colors: string[],
    axis?: Axes,
  ) {
    this.filters = stores.getClassifier().getFilters();
    this.trainingData = this.trainingDataToPoints();
    this.graphDrawer = new KNNModelGraphDrawer(svg, classId);
    this.rotationX = writable(3);
    this.rotationY = writable(0.5);
    this.rotationZ = writable(0);
    this.scale = writable(this.getDefaultScale());
    this.origin = writable(origin);
    this.graphColors = colors;

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

  private getControllerData(): {
    config: GraphDrawConfig;
    data: TimestampedData<MicrobitAccelerometerDataVector>[];
  } {
    const classifier = stores.getClassifier();
    const xRot = get(this.rotationX);
    const yRot = get(this.rotationY);
    const zRot = get(this.rotationZ);
    const scale = get(this.scale);
    const origin = get(this.origin);
    let liveData: TimestampedData<MicrobitAccelerometerDataVector>[] = [];

    try {
      const sampleDuration = StaticConfiguration.pollingPredictionSampleDuration;
      const sampleSize = StaticConfiguration.pollingPredictionSampleSize;
      liveData = get(stores)
        .liveData.getBuffer()
        .getSeries(sampleDuration, sampleSize)
        .map(el => {
          if (el.value.getSize() != 3) {
            throw new Error("Couldn't convert vector to accelerometer data vector");
          }
          return {
            ...el,
            value: new MicrobitAccelerometerDataVector({
              x: el.value.getVector()[0],
              y: el.value.getVector()[1],
              z: el.value.getVector()[2],
            }),
          };
        });
      this.liveDataRecords.push(liveData);
      if (this.liveDataRecords.length > this.liveDataRecordsSize) {
        this.liveDataRecords.shift();
      }
      liveData = this.calculateLiveDataRecordsAverage();
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
        colors: this.graphColors,
      },
      data: liveData,
    };
  }

  private calculateLiveDataRecordsAverage(): TimestampedData<MicrobitAccelerometerDataVector>[] {
    const noOfRecords = this.liveDataRecords.length;
    const vals = this.liveDataRecords.map(e => e.map(e => e.value));
    const samples1 = vals[0];
    const samples2 = vals[1];
    const samples3 = vals[2];

    const combined = samples1.map((sample, index) =>
      this.divAccelData(
        this.sumAccelData([sample, samples2[index], samples3[index]]),
        noOfRecords,
      ),
    );

    return combined.map(e => ({
      timestamp: 0, // ignored
      value: new MicrobitAccelerometerDataVector(e),
    }));
  }

  private divAccelData(
    data: MicrobitAccelerometerData,
    div: number,
  ): MicrobitAccelerometerData {
    if (div === 0) {
      throw new Error('Cannot divide by 0');
    }

    return {
      x: data.x / div,
      y: data.y / div,
      z: data.z / div,
    };
  }

  private sumAccelData(
    data: MicrobitAccelerometerDataVector[],
  ): MicrobitAccelerometerData {
    const sum = (nums: number[]): number => nums.reduce((pre, cur) => cur + pre, 0);

    return {
      x: sum(data.map(e => e.getVector()[0])),
      y: sum(data.map(e => e.getVector()[1])),
      z: sum(data.map(e => e.getVector()[2])),
    };
  }

  // Called whenever any subscribed store is altered
  private onUpdate(draw: UpdateCall, axis?: Axes) {
    let data: TimestampedData<MicrobitAccelerometerDataVector>[] = draw.data;

    const getLiveFilteredData = () => {
      switch (axis) {
        case Axes.X:
          return this.filters.compute(data.map(d => d.value.getAccelerometerData().x));
        case Axes.Y:
          return this.filters.compute(data.map(d => d.value.getAccelerometerData().y));
        case Axes.Z:
          return this.filters.compute(data.map(d => d.value.getAccelerometerData().z));
        default:
          throw new Error("Shouldn't happen");
      }
    };

    try {
      // Some filters throw when no filters data is available
      const liveData = getLiveFilteredData();
      this.graphDrawer.drawLiveData(draw.config, this.arrayToPoint(liveData));
    } catch (_ignored) {}

    if (this.redrawTrainingData) {
      const drawData: Point3D[][][] = [...this.trainingData];
      this.redrawTrainingData = false;
      this.graphDrawer.draw(draw.config, drawData);
    }
  }

  private arrayToPoint(numsIn: number[]): Point3D {
    const nums = [...numsIn];
    if (this.filters.count() === 2) {
      nums[2] = 0; // Set z-value to 0
    }

    let [x, y, z] = nums; //this.normalizeVector(nums);

    return { x, y, z };
  }

  private normalizeVector(nums: number[]): number[] {
    const magnitude = Math.sqrt(nums.reduce((prev, cur) => prev + Math.pow(cur, 2), 0));
    if (magnitude === 0) {
      throw new Error('Cannot normalize vector, magnitude is 0!');
    }
    return nums.map(el => el / magnitude);
  }
}
export const controller = writable<KNNModelGraphController | undefined>(undefined);
export default KNNModelGraphController;
