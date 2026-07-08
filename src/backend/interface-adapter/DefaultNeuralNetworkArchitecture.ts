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

/**
 * Used for initializing the neural network architecture in the ML machine. The architecture is not known at this point, so we just return a default architecture with one hidden layer. The actual architecture will be set later when the user changes the settings.
 */
export class DefaultNeuralNetworkArchitecture implements NeuralNetworkArchitecture {
  private hiddenLayers: NeuralNetworkLayerSettings[];

  public constructor(
    private noOfGestures: number,
    private noOfFeatures: number,
  ) {
    this.hiddenLayers = [new NeuralNetworkLayerSettingsImpl(16, ActivationFunction.RELU)];
  }

  public getInputLayer(): NeuralNetworkLayerSettings {
    return new NeuralNetworkLayerSettingsImpl(this.noOfFeatures, ActivationFunction.RELU);
  }

  public getHiddenLayers(): NeuralNetworkLayerSettings[] {
    return this.hiddenLayers;
  }

  public getOutputLayer(): NeuralNetworkLayerSettings {
    return new NeuralNetworkLayerSettingsImpl(
      this.noOfGestures,
      ActivationFunction.SOFTMAX,
    );
  }
}
