/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { ModelOptions } from './ModelOptions';

export class ModelOption {
  public constructor(private readonly option: ModelOptions) {}

  getType(): ModelOptions {
    return this.option;
  }

  getDisplayName(): string {
    // Return the display name directly from the enum value
    switch (this.option) {
      case ModelOptions.EPOCHS:
        return 'Epochs';
      case ModelOptions.BATCH_SIZE:
        return 'Batch Size';
      case ModelOptions.LEARNING_RATE:
        return 'Learning Rate';
      case ModelOptions.SELECTED_MODEL:
        return 'Selected Model';
      case ModelOptions.ARCHITECTURE:
        return 'Architecture';
      case ModelOptions.NORMALIZE:
        return 'Normalize';
      case ModelOptions.NUMBER_OF_CLASSES:
        return 'Number of Classes';
      case ModelOptions.K:
        return 'K';
      case ModelOptions.FILTERS:
        return 'Filters';
      case ModelOptions.SELECTED_AXES:
        return 'Selected Axes';
      default:
        return this.option;
    }
  }
}
