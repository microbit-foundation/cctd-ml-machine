/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export enum ActivationFunction {
  RELU,
  SOFTMAX,
}

export interface NeuralNetworkLayerSettings {
  getNumberOfNodes(): number;
  setNumberOfNodes(noOfNodes: number): void;
  getActivationFunction(): ActivationFunction;
}
