/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { AccuracyClassifierEvaluator } from '../../core/classifier/evaluator/AccuracyClassifierEvaluator';
import { VectorClassifier } from '../../core/classifier/vector-classifier/VectorClassifier';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { ModelTraining } from '../../core/model/ModelTraining';
import type { ModelTrainingListener } from '../../core/model/ModelTrainingObserver';
import { ModelType } from '../../core/model/ModelType';
import type { ClassifierService } from '../domain/ClassifierService';
import type { ModelService } from '../domain/ModelService';

/**
 * As settings change the knn model should be retrained and the classifier should be updated with the new model.
 * We can do this for KNN because the training process is much faster than for neural networks.
 */
export class KNNModelPendingSettingsListener implements ModelTrainingListener {
  private log: ConsoleLogger = new ConsoleLogger(KNNModelPendingSettingsListener.name);
  private modelService?: ModelService;
  private classifierService?: ClassifierService;

  setDependencies(
    modelService: ModelService,
    classifierService: ClassifierService,
  ): void {
    this.modelService = modelService;
    this.classifierService = classifierService;
  }

  async onModelTrainingChanged(modelTraining: ModelTraining): Promise<void> {
    if (modelTraining.isTraining()) {
      return;
    }
    if (!this.modelService || !this.classifierService) {
      this.log.warn(
        'ModelService is not set in KNNModelPendingSettingsListener. Cannot handle model training changes.',
      );
      return;
    }
    if (this.classifierService.getClassifier()?.getModelType() !== ModelType.KNN) {
      return;
    }
    if (this.modelService.getSelectedModel().getType() !== ModelType.KNN) {
      return;
    }
    if (!modelTraining.hasPendingSettings()) {
      return;
    }
    if (this.classifierService.getClassifier() == null) {
      return;
    }

    const model = await this.modelService.trainKNNModel();
    const evaluator = new AccuracyClassifierEvaluator();
    const classifier = new VectorClassifier(model, evaluator);
    this.classifierService?.setClassifier(classifier);
  }
}
