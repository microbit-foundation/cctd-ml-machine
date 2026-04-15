/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../core/classifier/Classifier';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { ModelTraining } from '../../core/model/ModelTraining';

export interface ClassifierService {
  trainKNNModel(): Promise<void>;
  trainNeuralNetworkModel(): Promise<void>;
  setNeuralNetworkSettings(neuralNetworkSettings: NeuralNetworkModelSettings): void;
  getNeuralNetworkSettings(): NeuralNetworkModelSettings;
  getClassifier(): Classifier | undefined;
  getModelTraining(): ModelTraining;
  unsetClassifier(): void;
}
