/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../core/classifier/Classifier';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkModelSettings';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { ModelTraining } from '../../core/model/ModelTraining';
import type { MLMachine } from '../interface-adapter/MLMachine';

export class ClassifierController {
  constructor(private mlMachine: MLMachine) {}

  public getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings> {
    return this.mlMachine.getClassifierService().getNeuralNetworkSettings();
  }

  public getClassifier(): AbstractState<Classifier | undefined> {
    return this.mlMachine.getClassifierService().getClassifier();
  }

  public getModelTraining(): AbstractState<ModelTraining> {
    return this.mlMachine.getClassifierService().getModelTraining();
  }

  public getGestureConfidence(gestureId: number) {
    return this.mlMachine.getClassifierService().getGestureConfidence(gestureId);
  }
}
