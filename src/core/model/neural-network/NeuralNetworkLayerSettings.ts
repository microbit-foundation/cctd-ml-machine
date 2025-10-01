/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export enum ActivationFunction {
  RELU,
  SOFTMAX,
}

export interface NeuralNetworkLayerSettings {
  getNoOfNodes(): number;
  getActivationFunction(): ActivationFunction;
}
