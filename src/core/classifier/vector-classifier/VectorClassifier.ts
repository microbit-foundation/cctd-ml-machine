/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Dataset } from '../../dataset/Dataset';
import type { Vector } from '../../vector/Vector';
import type { MLModel } from '../../model/MLModel';
import type { Classifier } from '../Classifier';
import type { ClassifierEvaluator } from '../ClassifierEvaluator';
import type { EvaluationResult } from '../EvaluationResult';
import type { PredictionInput } from '../Predictioninput';
import type { PredictionOutput } from '../PredictionOutput';
import { VectorPredictionInput } from './VectorPredictionInput';
import { VectorPredictionOutput } from './VectorPredictionOutput';

export class VectorClassifier implements Classifier {
  private model: MLModel; // A trained ML model
  private evaluator: ClassifierEvaluator;

  public constructor(model: MLModel, evaluator: ClassifierEvaluator) {
    this.model = model;
    this.evaluator = evaluator;
  }

  public async predict(input: PredictionInput): Promise<PredictionOutput> {
    const prediction: Vector = await this.model.predict(input.getInput());
    const predictionOutput = new VectorPredictionOutput(input, prediction);
    return predictionOutput;
  }

  /**
   * Evaluates the classifier on the provided test dataset and returns an EvaluationResult containing the accuracy and other relevant metrics.
   */
  public async evaluate(testData: Dataset): Promise<EvaluationResult> {
    const predictionInputs = this.getPredictionInputForDataset(testData);
    const predictions = predictionInputs.map(predInput => this.predict(predInput));
    const predictionResults = await Promise.all(predictions);
    return this.evaluator.getEvaluation(testData, predictionResults);
  }

  private getPredictionInputForDataset(dataset: Dataset): PredictionInput[] {
    return dataset
      .getFeatureSet()
      .map(classFeatures => new VectorPredictionInput(classFeatures.getFeatures()));
  }
}
