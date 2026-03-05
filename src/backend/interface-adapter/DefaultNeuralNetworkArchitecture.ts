/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkArchitecture } from '../../core/model/neural-network/NeuralNetworkArchitecture';
import {
  ActivationFunction,
  type NeuralNetworkLayerSettings,
} from '../../core/model/neural-network/NeuralNetworkLayerSettings';
import { NeuralNetworkLayerSettingsImpl } from '../../core/model/neural-network/NeuralNetworkLayerSettingsImpl';

export class DefaultNeuralNetworkArchitecture implements NeuralNetworkArchitecture {
  private hiddenLayers: NeuralNetworkLayerSettings[];

  public constructor() {
    this.hiddenLayers = [new NeuralNetworkLayerSettingsImpl(16, ActivationFunction.RELU)];
  }

  public getInputLayer(): NeuralNetworkLayerSettings {
    throw new Error('Input layer of architecture is unknown');
  }

  public getHiddenLayers(): NeuralNetworkLayerSettings[] {
    return this.hiddenLayers;
  }

  public getOutputLayer(): NeuralNetworkLayerSettings {
    throw new Error('Output layer of architecture is unknown');
  }
}
