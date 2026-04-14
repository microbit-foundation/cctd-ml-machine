import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { NerualNetworkTrainingIterationRepository } from '../domain/NerualNetworkTrainingIterationRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesTrainingIterationRepository
  implements NerualNetworkTrainingIterationRepository
{
  constructor(private states: AbstractStates) {}

  clear(): void {
    this.states.getNeuralNetworkTrainingIterations().set([]);
  }

  add(iteration: NeuralNetworkTrainingIteration): void {
    this.states.getNeuralNetworkTrainingIterations().update(e => {
      if (e === undefined) {
        return [iteration];
      }
      return [...e, iteration];
    });
  }

  getCurrentIteration(): NeuralNetworkTrainingIteration | undefined {
    const iterations = this.states.getNeuralNetworkTrainingIterations().get();
    if (iterations === undefined || iterations.length === 0) {
      return undefined;
    }
    return iterations[iterations.length - 1];
  }
}
