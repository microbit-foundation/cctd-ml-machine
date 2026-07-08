/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';

export interface NeuralNetworkSettingsService {
  setEpochs(epochs: number): void;
  setBatchSize(batchSize: number): void;
  setLearningRate(learningRate: number): void;
  getNeuralNetworkSettings(): NeuralNetworkModelSettings;
  /**
   * Sets the number of units in the hidden layer of the neural network.
   */
  setNumberOfUnits(units: number): void;
}
