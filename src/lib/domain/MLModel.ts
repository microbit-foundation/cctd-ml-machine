import type { Vector } from '../../core/model/vector/Vector';

/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export interface MLModel {
  predict(filteredData: Vector): Promise<number[]>;
}
