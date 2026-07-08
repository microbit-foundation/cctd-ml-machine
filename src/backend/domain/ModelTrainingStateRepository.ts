/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ModelTraining } from '../../core/model/ModelTraining';

export interface ModelTrainingStateRepository {
  getModelTraining(): ModelTraining;
  saveModelTraining(modelTraining: ModelTraining): void;
}
