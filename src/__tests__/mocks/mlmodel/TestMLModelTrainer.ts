/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Dataset } from '../../../core/dataset/Dataset';
import type { ModelInfo } from '../../../core/model/ModelRegistry';
import ModelRegistry from '../../../core/model/ModelRegistry';
import type { ModelTrainer, ModelTrainerResult } from '../../../core/model/ModelTrainer';
import TestMLModel from './TestMLModel';

class TestMLModelTrainer implements ModelTrainer<TestMLModel, {}> {
  constructor(private numberOfGestures: number) {}
  getModelInfo(): ModelInfo {
    return ModelRegistry.NeuralNetwork;
  }
  public trainModel(dataset: Dataset): Promise<ModelTrainerResult<TestMLModel, {}>> {
    return Promise.resolve({
      model: new TestMLModel(this.numberOfGestures),
      trainingInformation: {},
    });
  }
}

export default TestMLModelTrainer;
