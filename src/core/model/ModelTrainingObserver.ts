/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { ModelTraining } from './ModelTraining';

export interface ModelTrainingListener {
  onModelTrainingChanged(modelTraining: ModelTraining): Promise<void>;
}
