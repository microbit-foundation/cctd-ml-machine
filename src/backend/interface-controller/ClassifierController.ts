/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../core/classifier/Classifier';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { ModelTraining } from '../../core/model/ModelTraining';
import type { MLMachine } from '../interface-adapter/MLMachine';
import type { AbstractStates } from '../statemanagement/AbstractStates';
import type { ModelInfo } from '../../core/model/ModelInfo';
import type { GestureID } from '../../core/entities/NewGesture';

export class ClassifierController {
  constructor(
    private states: AbstractStates,
    private mlMachine: MLMachine,
  ) {}

  public async trainNeuralNetworkModel(): Promise<void> {
    const classifierService = this.mlMachine.getClassifierService();
    await classifierService.trainNeuralNetworkModel();
  }

  public setNeuralNetwork(neuralNetworkSettings: NeuralNetworkModelSettings) {
    this.mlMachine.getClassifierService().setNeuralNetworkSettings(neuralNetworkSettings);
  }

  public getClassifier(): AbstractState<Classifier | undefined> {
    return this.states.getClassifier();
  }

  public getModelTraining(): AbstractState<ModelTraining> {
    return this.states.getModelTraining();
  }

  public async trainKNNModel(): Promise<void> {
    const classifierService = this.mlMachine.getClassifierService();
    await classifierService.trainKNNModel();
  }

  public getSelectedModel(): AbstractState<ModelInfo> {
    return this.states.getSelectedModel();
  }

  public setSelectedModel(model: ModelInfo): void {
    this.mlMachine.getClassifierService().setSelectedModel(model);
  }
}
