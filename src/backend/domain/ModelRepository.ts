/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ModelInfo } from '../../core/model/ModelInfo';

export interface ModelRepository {
  getSelectedModel(): ModelInfo;
  setSelectedModel(model: ModelInfo): void;
}
