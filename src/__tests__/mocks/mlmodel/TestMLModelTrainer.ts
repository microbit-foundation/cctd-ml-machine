/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ModelTrainer } from '../../../script/domain/ModelTrainer';
import type { TrainingDataRepository } from '../../../script/domain/TrainingDataRepository';
import TestMLModel from './TestMLModel';

class TestMLModelTrainer implements ModelTrainer<TestMLModel> {
  constructor(private numberOfGestures: number) {}
  public trainModel(trainingData: TrainingDataRepository): Promise<TestMLModel> {
    return Promise.resolve(new TestMLModel(this.numberOfGestures));
  }
}

export default TestMLModelTrainer;
