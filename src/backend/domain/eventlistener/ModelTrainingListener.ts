/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type KNNMLModel from '../../../core/model/KNN/KNNMLModel';
import type { KNNMLModelTrainingResult } from '../../../core/model/KNN/KNNMLModelTrainingResult';
import type { ModelTrainerResult } from '../../../core/model/ModelTrainer';

export interface ModelTrainingListener {
  onModelTrained(model: ModelTrainerResult<KNNMLModel, KNNMLModelTrainingResult>): void;
}
