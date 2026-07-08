/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../vector/Vector';
import type { ModelType } from './ModelType';

export interface MLModel {
  getType(): ModelType;
  predict(filteredData: Vector): Promise<Vector>;
}
