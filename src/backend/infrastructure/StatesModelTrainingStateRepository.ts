/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ModelTraining } from '../../core/model/ModelTraining';
import type { ModelTrainingListener } from '../../core/model/ModelTrainingObserver';
import type { ModelTrainingStateRepository } from '../domain/ModelTrainingStateRepository';
import type { AbstractState } from '../statemanagement/AbstractState';

export class StatesModelTrainingStateRepository implements ModelTrainingStateRepository {
  private modelTrainingState: AbstractState<ModelTraining>;

  public constructor(
    initialModelTraining: AbstractState<ModelTraining>,
    private modelTrainingListeners: ModelTrainingListener[],
  ) {
    this.modelTrainingState = initialModelTraining;
  }

  public getModelTraining(): ModelTraining {
    return this.modelTrainingState.get();
  }

  public saveModelTraining(modelTraining: ModelTraining): void {
    this.modelTrainingState.set(modelTraining);
    this.modelTrainingListeners.map(async (listener) => await listener.onModelTrainingChanged(modelTraining))
  }
}
