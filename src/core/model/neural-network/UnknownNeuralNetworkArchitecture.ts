/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkArchitecture } from './NeuralNetworkArchitecture';
import type { NeuralNetworkLayerSettings } from './NeuralNetworkLayerSettings';

export class UnknownNeuralNetworkArchitecture implements NeuralNetworkArchitecture {
  getInputLayer(): NeuralNetworkLayerSettings {
    throw new Error(
      'Neural Network architecture is unknown. Have you forgotten to set it?',
    );
  }
  getHiddenLayers(): NeuralNetworkLayerSettings[] {
    throw new Error(
      'Neural Network architecture is unknown. Have you forgotten to set it?',
    );
  }
  getOutputLayer(): NeuralNetworkLayerSettings {
    throw new Error(
      'Neural Network architecture is unknown. Have you forgotten to set it?',
    );
  }
}
