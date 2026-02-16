import type { Axis } from '../Axis';
import type { Recording } from './Recording';
import { Sample } from './Sample';

export class RecordingImpl implements Recording {
  constructor(private id: number, private samples: Sample[], private axes: Axis[]) { }

  getId(): number {
    return this.id;
  }
  getSamples(): Sample[] {
    return this.samples;
  }
  getAxes(): Axis[] {
    return this.axes;
  }
}
