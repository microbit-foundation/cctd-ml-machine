/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface NeuralNetworkModelBaseSettings {
  getLearningRate(): number;
  getNumberOfEpochs(): number;
  getBatchSize(): number;
  getValidationSplit(): number;
}
