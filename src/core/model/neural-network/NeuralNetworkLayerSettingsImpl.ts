/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type {
  ActivationFunction,
  NeuralNetworkLayerSettings,
} from './NeuralNetworkLayerSettings';

export class NeuralNetworkLayerSettingsImpl implements NeuralNetworkLayerSettings {
  private numberOfNodes: number;
  private activationFunction: ActivationFunction;

  public constructor(numberOfNodes: number, activationFunction: ActivationFunction) {
    this.numberOfNodes = numberOfNodes;
    this.activationFunction = activationFunction;
  }

  public getNumberOfNodes(): number {
    return this.numberOfNodes;
  }

  public setNumberOfNodes(noOfNodes: number): void {
    this.numberOfNodes = noOfNodes;
  }

  public getActivationFunction(): ActivationFunction {
    return this.activationFunction;
  }
}
