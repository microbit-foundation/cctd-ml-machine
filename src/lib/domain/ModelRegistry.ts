/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export type ModelInfo = {
  id: string;
  title: string;
  label: string;
};

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
