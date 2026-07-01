import type { DatasetLabels } from '../dataset/DatasetLabels';
import ConsoleLogger from '../logging/ConsoleLogger';
import type { Vector } from '../vector/Vector';
import AccuracyMatrix from './AccuracyMatrix';
import type { PredictionOutput } from './PredictionOutput';

export class AccuracyMatrixFactory {
  private log = new ConsoleLogger(AccuracyMatrixFactory.name);

  create(
    numberOfClasses: number,
    labels: DatasetLabels,
    outputs: PredictionOutput[],
  ): AccuracyMatrix {
    this.log.info(
      `Creating accuracy matrix for ${numberOfClasses} classes, ${labels.getLabelVectors().length} labels and ${outputs.length} outputs`,
    );
    const matrix = AccuracyMatrix.fromSize(numberOfClasses);
    const labelVectors = labels.getLabelVectors();

    if (labelVectors.length !== outputs.length) {
      throw new Error('Labels and prediction outputs size mismatch');
    }

    for (let i = 0; i < labelVectors.length; i++) {
      const trueLabelVector = labelVectors[i];
      const predictedLabelVector = outputs[i];

      const trueLabelIndex = this.getLabelIndex(trueLabelVector);
      const predictedLabelIndex = predictedLabelVector.getPredictedIndex();

      matrix.increment(trueLabelIndex, predictedLabelIndex);
    }

    return matrix;
  }

  private getLabelIndex(labelVector: Vector): number {
    const labelIndex = labelVector.getValue().findIndex(value => value === 1);
    if (labelIndex === -1) {
      throw new Error(`Invalid label vector: ${labelVector.getValue()}`);
    }
    return labelIndex;
  }
}
