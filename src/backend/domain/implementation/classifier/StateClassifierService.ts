/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../../../core/classifier/Classifier';
import type { ModelTraining } from '../../../../core/model/ModelTraining';
import type { NeuralNetworkModelSettings } from '../../../../core/model/neural-network/NeuralNetworkModelSettings';
import type { AbstractState } from '../../../interface-adapter/AbstractState';
import type { ClassifierService } from '../../ClassifierService';

export class StateClassifierService implements ClassifierService {
  // TODO: Remove dependency on abstract state. Move to a repository interface instead

  constructor(
    private neuralNetworkSettings: AbstractState<NeuralNetworkModelSettings>,
    private classifier: AbstractState<Classifier | undefined>,
    private modelTraining: AbstractState<ModelTraining>,
  ) {}

  public unsetClassifier(): void {
    this.getClassifier().set(undefined);
  }

  public getModelTraining(): AbstractState<ModelTraining> {
    return this.modelTraining;
  }

  public getClassifier(): AbstractState<Classifier | undefined> {
    return this.classifier;
  }

  public getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings> {
    return this.neuralNetworkSettings;
  }
}
