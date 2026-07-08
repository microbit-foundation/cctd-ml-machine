/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NeuralNetworkTrainingIteration } from '../../../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { NeuralNetworkTrainingObserver } from '../../../../core/model/neural-network/NeuralNetworkTrainingObserver';
import type { NerualNetworkTrainingIterationRepository } from '../../NerualNetworkTrainingIterationRepository';

export class NeuralNetworkTrainingLossObserver implements NeuralNetworkTrainingObserver {
  constructor(
    private trainingIterationRepository: NerualNetworkTrainingIterationRepository,
  ) {}
  handleTrainingIteration(iteration: NeuralNetworkTrainingIteration): void {
    this.trainingIterationRepository.add(iteration);
  }
}
