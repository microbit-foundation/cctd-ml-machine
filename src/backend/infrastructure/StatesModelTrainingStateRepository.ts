import type { ModelTraining } from '../../core/model/ModelTraining';
import type { ModelTrainingObserver } from '../../core/model/ModelTrainingObserver';
import type { ModelTrainingStateRepository } from '../domain/ModelTrainingStateRepository';
import type { AbstractState } from '../statemanagement/AbstractState';

export class StatesModelTrainingStateRepository implements ModelTrainingStateRepository {
  private modelTraining: AbstractState<ModelTraining>;

  public constructor(initialModelTraining: AbstractState<ModelTraining>, modelTrainingObserver: ModelTrainingObserver[]) {
    this.modelTraining = initialModelTraining;
  }

  public getModelTraining(): ModelTraining {
    return this.modelTraining.get();
  }

  public saveModelTraining(modelTraining: ModelTraining): void {
    this.modelTraining.set(modelTraining);
  }
}
