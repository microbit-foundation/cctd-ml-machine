/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkModelBaseSettings } from '../../core/model/neural-network/NeuralNetworkModelBaseSettings';

export class DefaultNeuralNetworkModelBaseSettings
  implements NeuralNetworkModelBaseSettings
{
  public getLearningRate(): number {
    return 0.1;
  }
  public getNumberOfEpochs(): number {
    return 80;
  }
  public getBatchSize(): number {
    return 16;
  }
  public getValidationSplit(): number {
    return 0.1;
  }
}
