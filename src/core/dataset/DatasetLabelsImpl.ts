import type { Vector } from '../vector/Vector';
import type { DatasetLabels } from './DatasetLabels';
import { DataIndexLabel } from './DataIndexLabel';

export class DatasetLabelsImpl implements DatasetLabels {
  constructor(private labelVectors: Vector[]) {}

  getLabelVectors(): Vector[] {
    return this.labelVectors;
  }
  getIndexLabels(): DataIndexLabel[] {
    return this.labelVectors.map(vec => new DataIndexLabel(vec));
  }
}
