/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';

export interface NeuralNetworkRepository {
  getNeuralNetworkSettings(): NeuralNetworkModelSettings;
  setNeuralNetworkSettings(settings: NeuralNetworkModelSettings): void;
}
