/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Logger } from '../../logging/Logger';
import type { NeuralNetworkTrainingIteration } from './NeuralNetworkTrainingIteration';
import type { NeuralNetworkTrainingObserver } from './NeuralNetworkTrainingObserver';

export class LoggingNeuralNetworkTrainingObserver
  implements NeuralNetworkTrainingObserver
{
  public constructor(private logger: Logger) {}

  handleTrainingIteration(iteration: NeuralNetworkTrainingIteration): void {
    this.logger.log(`Epoch ${iteration.epoch} - Loss: ${iteration.loss}`);
  }
}
