/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkLayerSettings } from './NeuralNetworkLayerSettings';

export interface NeuralNetworkArchitecture {
  getInputLayer(): NeuralNetworkLayerSettings;
  getHiddenLayers(): NeuralNetworkLayerSettings[];
  getOutputLayer(): NeuralNetworkLayerSettings;
}
