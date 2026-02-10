import type { Sample } from './Sample';

export interface Recording {
  getId(): number;
  getSamples(): Sample[];
}
