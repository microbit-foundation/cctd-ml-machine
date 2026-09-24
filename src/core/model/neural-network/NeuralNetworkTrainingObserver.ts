/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkTrainingIteration } from './NeuralNetworkTrainingIteration';

export interface NeuralNetworkTrainingObserver {
  handleTrainingIteration(iteration: NeuralNetworkTrainingIteration): void;
}
