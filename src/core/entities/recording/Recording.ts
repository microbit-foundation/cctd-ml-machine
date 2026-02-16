import type { Axis } from '../Axis';
import type { Sample } from './Sample';

export interface Recording {
  getId(): number;
  getSamples(): Sample[];
  getAxes(): Axis[];
}
