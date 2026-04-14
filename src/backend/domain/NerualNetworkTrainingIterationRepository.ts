import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';

export interface NerualNetworkTrainingIterationRepository {
  save(iteration: NeuralNetworkTrainingIteration): void;
  getCurrentIteration(): NeuralNetworkTrainingIteration | undefined;
}
