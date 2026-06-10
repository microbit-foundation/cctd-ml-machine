/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../../../core/classifier/Classifier';
import type { ClassifierRepository } from '../../ClassifierRepository';
import type { ClassifierService } from '../../ClassifierService';
import type { PredictionOutput } from '../../../../core/classifier/PredictionOutput';
import type { PredictionInput } from '../../../../core/classifier/Predictioninput';
import type { PredictionRepository } from '../../PredictionRepository';

export class ClassifierServiceImpl implements ClassifierService {

  constructor(
    private classifierRepository: ClassifierRepository,
    private predictionRepository: PredictionRepository,
  ) { }

  setClassifier(classifier: Classifier): void {
    this.classifierRepository.setClassifier(classifier);
  }

  async predict(predictionInput: PredictionInput): Promise<PredictionOutput> {
    const classifier = this.getClassifier();
    if (classifier === undefined) {
      throw new Error('No classifier is currently selected.');
    }
    const predictedOutput = await classifier.predict(predictionInput);
    this.predictionRepository.savePrediction(predictedOutput);
    return predictedOutput;
  }

  public unsetClassifier(): void {
    this.classifierRepository.setClassifier(undefined);
  }

  public getClassifier(): Classifier | undefined {
    return this.classifierRepository.getClassifier();
  }
}
