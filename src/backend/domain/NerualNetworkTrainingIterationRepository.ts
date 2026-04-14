import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';

export interface NerualNetworkTrainingIterationRepository {
  clear(): void;
  add(iteration: NeuralNetworkTrainingIteration): void;
  getCurrentIteration(): NeuralNetworkTrainingIteration | undefined;
}
