import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesTrainingIterationRepository {
  constructor(private states: AbstractStates) {}

  save(iteration: NeuralNetworkTrainingIteration): void {
    this.states.getNeuralNetworkTrainingIteration().set(iteration);
  }

  getCurrentIteration(): NeuralNetworkTrainingIteration | undefined {
    return this.states.getNeuralNetworkTrainingIteration().get();
  }
}
