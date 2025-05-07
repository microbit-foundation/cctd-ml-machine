/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ModelTrainer } from '../../../lib/domain/ModelTrainer';
import type { TrainingDataRepository } from '../../../lib/domain/TrainingDataRepository';
import TestMLModel from './TestMLModel';

class TestMLModelTrainer implements ModelTrainer<TestMLModel> {
  constructor(private numberOfGestures: number) {}
  public trainModel(trainingData: TrainingDataRepository): Promise<TestMLModel> {
    return Promise.resolve(new TestMLModel(this.numberOfGestures));
  }
}

export default TestMLModelTrainer;
