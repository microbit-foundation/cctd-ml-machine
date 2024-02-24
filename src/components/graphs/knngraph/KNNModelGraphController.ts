import * as d3 from 'd3';
import { Point3D, Point3DTransformed } from '../../../script/TypingUtils';
import { TrainingData } from '../../../script/domain/ModelTrainer';
import { Writable, derived, get, writable } from 'svelte/store';
import {
  triangles3D,
  cubes3D,
  gridPlanes3D,
  points3D,
  lineStrips3D,
  lines3D,
} from 'd3-3d';
import KNNModelGraphDrawer, { GraphDrawConfig } from './KNNModelGraphDrawer';
import { classifier, liveAccelerometerData } from '../../../script/stores/Stores';
import StaticConfiguration from '../../../StaticConfiguration';
import { MicrobitAccelerometerData } from '../../../script/livedata/MicrobitAccelerometerData';
import { TimestampedData } from '../../../script/domain/LiveDataBuffer';
import SmoothedLiveData from '../../../script/livedata/SmoothedLiveData';

type SampleData = {
  value: number[];
};

class KNNModelGraphController {
  private rotationX: Writable<number>;
  private rotationY: Writable<number>;
  private rotationZ: Writable<number>;
  private origin = { x: 250, y: 250 }; // Should be derived from svg element size
  private scale: Writable<number>;

  public constructor(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    private trainingDataGetter: () => TrainingData,
  ) {
    const graphDrawer = new KNNModelGraphDrawer(svg);
    this.rotationX = writable(0.5);
    this.rotationY = writable(0.5);
    this.rotationZ = writable(0);
    this.scale = writable(100);

    // Derived store ensures, if any of the inputs are updated, the draw call will be called again
    derived(
      [this.rotationX, this.rotationY, this.rotationZ, this.scale, liveAccelerometerData],
      stores => {
        const xRot = stores[0];
        const yRot = stores[1];
        const zRot = stores[2];
        const scale = stores[3];
        let liveData: TimestampedData<MicrobitAccelerometerData>[] = [];

        try {
          liveData = liveAccelerometerData
            .getBuffer()
            .getSeries(
              StaticConfiguration.pollingPredictionSampleDuration,
              StaticConfiguration.pollingPredictionSampleSize,
            );
        } catch (error) {
          liveData = [];
        }
        // Given as input to the draw function
        return {
          config: {
            xRot,
            yRot,
            zRot,
            origin: this.origin,
            scale,
          } as GraphDrawConfig,
          data: liveData,
        };
      },
    ).subscribe(draw => {
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

      const liveData = [[toPoint(filteredXs), toPoint(filteredYs), toPoint(filteredZs)]];
      const drawData = this.trainingDataToPoints(); // Training data
      if (!filteredXs.includes(NaN)) {
        drawData.push(liveData);
      }
      graphDrawer.draw(draw.config, drawData);
    });
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

  private trainingDataToPoints(): Point3D[][][] {
    const data = this.trainingDataGetter();
    return data.classes.map(clazz => this.classToPoints(clazz));
  }

  private classToPoints(clazz: { samples: SampleData[] }): Point3D[][] {
    return clazz.samples.map(sample => this.sampleToPoints(sample));
  }

  private sampleToPoints(sample: SampleData): Point3D[] {
    const xs = [];
    const ys = [];
    const zs = [];
    for (let i = 0; i < sample.value.length; i += 3) {
      const element = sample.value[i];
      xs.push(element);
    }
    for (let i = 1; i < sample.value.length; i += 3) {
      const element = sample.value[i];
      ys.push(element);
    }
    for (let i = 2; i < sample.value.length; i += 3) {
      const element = sample.value[i];
      zs.push(element);
    }

    const points = [];

    for (let i = 0; i < 3; i++) {
      const point: Point3D = {
        x: xs[i],
        y: ys[i],
        z: zs[i],
      };
      points.push(point);
    }
    return points;
  }
}
export default KNNModelGraphController;
