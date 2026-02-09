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

export class AccuracyClassifierEvaluator implements ClassifierEvaluator {
  public getEvaluation(
    dataset: Dataset,
    predictionOutput: PredictionOutput[],
  ): EvaluationResult {
    const labelIndices = this.getLabelIndices(dataset.getLabels().getLabelVectors());
    const predictedIndices = this.getLabelIndices(
      predictionOutput.map(output => output.getPrediction()),
    );

    if (labelIndices.length !== predictedIndices.length) {
      throw new Error('Incorrect dataset or prediction outputs size');
    }

    const accuracy = this.calculateAccuracy(labelIndices, predictedIndices);

    return {
      getAccuracy: () => accuracy,
    };
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
