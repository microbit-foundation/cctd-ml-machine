/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';

export interface NerualNetworkTrainingIterationRepository {
  clear(): void;
  add(iteration: NeuralNetworkTrainingIteration): void;
  getCurrentIteration(): NeuralNetworkTrainingIteration | undefined;
}
