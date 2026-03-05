/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkArchitecture } from './NeuralNetworkArchitecture';
import {
  ActivationFunction,
  type NeuralNetworkLayerSettings,
} from './NeuralNetworkLayerSettings';
import { NeuralNetworkLayerSettingsImpl } from './NeuralNetworkLayerSettingsImpl';

export class BasicNeuralNetworkArchitecture implements NeuralNetworkArchitecture {
  public constructor(
    private noOfClasses: number,
    private noOfFilters: number,
    private noOfNodesInHiddenLayer: number,
  ) {}

  public getInputLayer(): NeuralNetworkLayerSettings {
    return new NeuralNetworkLayerSettingsImpl(this.noOfFilters, ActivationFunction.RELU);
  }
  public getHiddenLayers(): NeuralNetworkLayerSettings[] {
    return [
      new NeuralNetworkLayerSettingsImpl(
        this.noOfNodesInHiddenLayer,
        ActivationFunction.RELU,
      ),
    ];
  }
  public getOutputLayer(): NeuralNetworkLayerSettings {
    return new NeuralNetworkLayerSettingsImpl(
      this.noOfClasses,
      ActivationFunction.SOFTMAX,
    );
  }
}
