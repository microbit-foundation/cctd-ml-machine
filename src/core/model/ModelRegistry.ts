import { ModelInfo } from './ModelInfo';
import { ModelType } from './ModelType';

/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
class ModelRegistry {
  public static NeuralNetwork: ModelInfo = new ModelInfo(
    ModelType.NeuralNetwork,
    'Neural Network',
    'Neural Network',
  );

  public static KNN: ModelInfo = new ModelInfo(
    ModelType.KNN,
    'K-Nearest Neighbour',
    'KNN',
  );

  public static getModelsInfo(): ModelInfo[] {
    return [this.NeuralNetwork, this.KNN];
  }

  public static getModelInfo(modelType: ModelType): ModelInfo {
    return this.getModelsInfo().find(modelInfo => modelInfo.getType() === modelType)!;
  }
}

export default ModelRegistry;
