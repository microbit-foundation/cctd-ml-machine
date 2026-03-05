/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../core/classifier/Classifier';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkModelSettings';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { ModelTraining } from '../../core/model/ModelTraining';

export interface ClassifierService {
  getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings>;
  getClassifier(): AbstractState<Classifier | undefined>;
  getModelTraining(): AbstractState<ModelTraining>;
  unsetClassifier(): void;
}
