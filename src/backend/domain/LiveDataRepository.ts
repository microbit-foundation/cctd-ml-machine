/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { TimestampedData } from '../../core/LiveDataBuffer';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';

export interface LiveDataRepository {
  addInput(data: LiveDataVector): void;
  getSeries(time: number, noOfElements: number): TimestampedData<LiveDataVector>[];
}
