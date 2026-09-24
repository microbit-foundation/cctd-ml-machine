/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/**
 * @deprecated This file is deprecated and should not be used. It will be removed in a future release. Please use the ModelInfo type and ModelRegistry class in the core/model directory instead.
 */
export type ModelInfo = {
  id: string;
  title: string;
  label: string;
};

/**
 * @deprecated This file is deprecated and should not be used. It will be removed in a future release. Please use the ModelInfo type and ModelRegistry class in the core/model directory instead.
 */
class ModelRegistry {
  public static NeuralNetwork: ModelInfo = {
    id: 'NN',
    title: 'Neural network',
    label: 'neural network',
  };

  public static KNN: ModelInfo = {
    id: 'KNN',
    title: 'KNN',
    label: 'KNN',
  };

  public static getModels(): ModelInfo[] {
    return [this.NeuralNetwork, this.KNN];
  }
}

export default ModelRegistry;
