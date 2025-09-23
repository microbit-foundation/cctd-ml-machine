/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ModelInfo } from '../../../core/entities/classifier/models/ModelRegistry';
import ModelRegistry from '../../../core/entities/classifier/models/ModelRegistry';
import type { ModelTrainer } from '../../../core/entities/classifier/models/ModelTrainer';
import type { TrainingDataRepository } from '../../../lib/domain/TrainingDataRepository';
import TestMLModel from './TestMLModel';

class TestMLModelTrainer implements ModelTrainer<TestMLModel> {
  constructor(private numberOfGestures: number) {}
  getModelInfo(): ModelInfo {
    return ModelRegistry.NeuralNetwork;
  }
  public trainModel(trainingData: TrainingDataRepository): Promise<TestMLModel> {
    return Promise.resolve(new TestMLModel(this.numberOfGestures));
  }
}

export default TestMLModelTrainer;
