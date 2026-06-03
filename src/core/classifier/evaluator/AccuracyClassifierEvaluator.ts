/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { ClassifierEvaluator } from '../ClassifierEvaluator';
import type { Dataset } from '../../dataset/Dataset';
import type { EvaluationResult } from '../EvaluationResult';
import type { PredictionOutput } from '../PredictionOutput';
import type { Vector } from '../../vector/Vector';
import { DataIndexLabel } from '../../dataset/DataIndexLabel';
import ConsoleLogger from '../../logging/ConsoleLogger';
import { AccuracyMatrixFactory } from '../AccuracyMatrixFactory';

export class AccuracyClassifierEvaluator implements ClassifierEvaluator {

  private log = new ConsoleLogger(AccuracyClassifierEvaluator.name);

  public getEvaluation(
    dataset: Dataset,
    predictionOutput: PredictionOutput[],
  ): EvaluationResult {
    const labels = dataset.getLabels();
    const labelIndices = this.getLabelIndices(labels.getLabelVectors());
    const predictedIndices = this.getLabelIndices(
      // We round because label indices are expected to be 0 or 1. Confidence is rarely 100% on one class.
      predictionOutput.map(output => output.getPrediction().round(0)),
    );

    if (labelIndices.length !== predictedIndices.length) {
      throw new Error('Incorrect dataset or prediction outputs size');
    }

    const accuracy = this.calculateAccuracy(labelIndices, predictedIndices);

    const matrixFactory = new AccuracyMatrixFactory();
    const matrix = matrixFactory.create(dataset.getNumberOfClasses(), labels, predictionOutput);
    const confusionBuckets = this.getConfusionBuckets(labelIndices, predictedIndices, dataset.getNumberOfClasses());
    this.log.log(`Evaluation result: ${accuracy}`);

    return {
      getAccuracy: () => accuracy,
      getAccuracyMatrix: () => matrix,
      getPredictionIndices: () => predictionOutput.map(output => output.getPrediction().indexOfMax()),
      getConfusionBuckets: () => confusionBuckets,
    };
  }

  private getConfusionBuckets(labelIndices: number[], predictedIndices: number[], numberOfClasses: number): number[][] {
    const buckets: number[][] = Array.from({ length: numberOfClasses }, () => []);

    for (let i = 0; i < labelIndices.length; i++) {
      const trueLabelIdx = labelIndices[i];
      const predictedLabelIdx = predictedIndices[i];
      buckets[trueLabelIdx].push(predictedLabelIdx);
    }

    return buckets;
  }

  private getLabelIndices(labelVectors: Vector[]): number[] {
    return labelVectors
      .map(vector => new DataIndexLabel(vector))
      .map(vectorDatasetLabel => vectorDatasetLabel.getIndex());
  }

  private calculateAccuracy(
    correctIndices: number[],
    predictedIndices: number[],
  ): number {
    console.assert(correctIndices.length === predictedIndices.length);
    const totalPredictionsCount = predictedIndices.length;

    let accuratePredictionCount = 0;
    for (let i = 0; i < correctIndices.length; i++) {
      const correctIdx = correctIndices[i];
      const predictedIdx = predictedIndices[i];
      if (correctIdx === predictedIdx) {
        accuratePredictionCount += 1;
      }
    }

    return accuratePredictionCount / totalPredictionsCount;
  }
}
