/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface NeuralNetworkModelBaseSettings {
  getLearningRate(): number;
  setLearningRate(learningRate: number): void;
  getNumberOfEpochs(): number;
  setNumberOfEpochs(numberOfEpochs: number): void;
  getBatchSize(): number;
  setBatchSize(batchSize: number): void;
  getValidationSplit(): number;
  setValidationSplit(validationSplit: number): void;
}
