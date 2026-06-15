import type { Vector } from '../vector/Vector';
import type { DatasetLabels } from './DatasetLabels';
import { DataIndexLabel } from './DataIndexLabel';

export class DatasetLabelsImpl implements DatasetLabels {

  private indexLabels: DataIndexLabel[];

  constructor(private labelVectors: Vector[]) {
    this.indexLabels = labelVectors.map(vec => {
      return new DataIndexLabel(vec);
    });
    this.validateLabelVectors(labelVectors);
  }

  getLabelVectors(): Vector[] {
    return this.labelVectors;
  }

  getIndexLabels(): DataIndexLabel[] {
    return this.indexLabels;
  }

  private validateLabelVectors(labelVectors: Vector[]): void {
    if (labelVectors.length === 0) {
      return; // Empty dataset, no need to validate vector lengths
    }
    const vectorLength = labelVectors[0].getValue().length;
    for (const vector of labelVectors) {
      if (vector.getValue().length !== vectorLength) {
        throw new Error('All label vectors must have the same length');
      }
    }
  }
}
