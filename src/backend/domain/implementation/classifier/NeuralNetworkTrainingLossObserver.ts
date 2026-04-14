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
