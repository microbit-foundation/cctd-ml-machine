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

type SampleData = {
  value: number[];
};

class KNNModelGraphController {
  private svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  private rotationX: Writable<number>;
  private rotationY: Writable<number>;
  private rotationZ: Writable<number>;
  private origin = { x: 150, y: 150 };
  private scale = 40;

  public constructor(
    svg: SVGElement,
    private trainingDataGetter: () => TrainingData,
  ) {
    this.svg = d3.selectAll(svg.id);
    this.rotationX = writable(0);
    this.rotationY = writable(0);
    this.rotationZ = writable(0);

    derived([this.rotationX, this.rotationY, this.rotationZ], stores => {
        const xRot = stores[0];
        const yRot = stores[1];
        const zRot = stores[2];
        this.svg.selectAll("*").remove(); // clear svg
        // this.draw()
    })
  }

  private getPointTransformer(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.getBaseTransformer(points3D())
  }

  private getLineTransformer(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.getBaseTransformer(lines3D())
  }

  private getBaseTransformer(transformer:any): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return transformer
    .rotateX(get(this.rotationX))
    .rotateY(get(this.rotationY))
    .rotateZ(get(this.rotationZ))
    .origin(this.origin)
    .scale(this.scale);
  }

  private trainingDataToPoints(): Point3DTransformed[][][] {
    const data = this.trainingDataGetter();
    return data.classes.map(clazz => this.classToPoints(clazz));
  }

  private classToPoints(clazz: { samples: SampleData[] }): Point3DTransformed[][] {
    return clazz.samples.map(sample => this.sampleToPoints(sample));
  }

  private sampleToPoints(sample: SampleData): Point3DTransformed[] {
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
    return pointTransform(points);
  }
}
export default KNNModelGraphController;
