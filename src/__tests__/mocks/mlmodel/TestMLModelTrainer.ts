/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ModelTrainer, { TrainingData } from '../../../script/domain/ModelTrainer';
import TestMLModel from './TestMLModel';

class TestMLModelTrainer implements ModelTrainer<TestMLModel> {
  constructor(private numberOfGestures: number) {}
  public trainModel(trainingData: TrainingData): Promise<TestMLModel> {
    return Promise.resolve(new TestMLModel(this.numberOfGestures));
  }
}

export default TestMLModelTrainer;
