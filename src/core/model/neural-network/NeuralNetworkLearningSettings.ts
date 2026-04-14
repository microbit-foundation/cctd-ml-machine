/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkTrainingObserver } from './NeuralNetworkTrainingObserver';
import type { NeuralNetworkArchitecture } from './NeuralNetworkArchitecture';
import type { NeuralNetworkModelLearningSettings } from './NeuralNetworkModelBaseSettings';

export interface NeuralNetworkModelSettings {
  getLearningSettings(): NeuralNetworkModelLearningSettings;
  getArchitecture(): NeuralNetworkArchitecture;
  getTrainingObserver(): NeuralNetworkTrainingObserver;
}
