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
import type { ClassifierService } from '../domain/ClassifierService';
import type { ModelService } from '../domain/ModelService';
import { AccuracyClassifierEvaluator } from '../../core/classifier/evaluator/AccuracyClassifierEvaluator';
import { VectorClassifier } from '../../core/classifier/vector-classifier/VectorClassifier';
import type { PredictionOutput } from '../../core/classifier/PredictionOutput';
import ConsoleLogger from '../../core/logging/ConsoleLogger';

export class ClassifierController {

  private log = new ConsoleLogger(ClassifierController.name);

  constructor(
    private states: AbstractStates,
    private mlMachine: MLMachine,
    private classifierService: ClassifierService,
    private modelService: ModelService
  ) {}

  getPrediction(): AbstractState<PredictionOutput | undefined> {
    return this.states.getPredictionState();
  }

  public clearClassifier(): void {
    this.classifierService.unsetClassifier();
  }

  public async trainNeuralNetworkModel(): Promise<void> {
    const classifierService = this.mlMachine.getClassifierService();
    const model = await this.modelService.trainNeuralNetworkModel();

    // TODO: add this in a factory
    const evaluator = new AccuracyClassifierEvaluator();
    const classifier = new VectorClassifier(model, evaluator);
    classifierService.setClassifier(classifier);
  }

  public getClassifier(): AbstractState<Classifier | undefined> {
    return this.states.getClassifier();
  }

  public getModelTraining(): AbstractState<ModelTraining> {
    return this.states.getModelTraining();
  }

  public async trainKNNModel(): Promise<void> {
    const classifierService = this.mlMachine.getClassifierService();
    const model = await this.modelService.trainKNNModel();

    // TODO: add this in a factory
    const evaluator = new AccuracyClassifierEvaluator();
    const classifier = new VectorClassifier(model, evaluator);
    classifierService.setClassifier(classifier);
  }

  public getSelectedModel(): AbstractState<ModelInfo> {
    return this.states.getSelectedModel();
  }

  public setSelectedModel(model: ModelInfo): void {
    this.modelService.setSelectedModel(model);
  }
}
