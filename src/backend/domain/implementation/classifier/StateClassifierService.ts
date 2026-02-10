/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../../../core/classifier/Classifier';
import type { ModelTraining } from '../../../../core/model/ModelTraining';
import type { NeuralNetworkModelSettings } from '../../../../core/model/neural-network/NeuralNetworkModelSettings';
import type { AbstractState } from '../../../statemanagement/AbstractState';
import type { ClassifierService } from '../../ClassifierService';

export class StateClassifierService implements ClassifierService {
  // TODO: Remove dependency on abstract state. Move to a repository interface instead

  constructor(
    private neuralNetworkSettings: AbstractState<NeuralNetworkModelSettings>,
    private classifier: AbstractState<Classifier | undefined>,
    private modelTraining: AbstractState<ModelTraining>,
  ) {}

  public unsetClassifier(): void {
    this.classifier.set(undefined);
  }

  public getModelTraining(): AbstractState<ModelTraining> {
    return this.modelTraining;
  }

  public getClassifier(): Classifier {
    return this.classifier.get()!;
  }

  public getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings> {
    return this.neuralNetworkSettings;
  }
}
