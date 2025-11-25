/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { Vector } from '../../core/vector/Vector';

export interface DataService {
  addLiveData(input: LiveDataVector): void;
  setSelectedAxes(axes: Axis[]): void;
  toggleAxis(axis: Axis): void;
  getAvailableAxes(): Axis[];
  getSelectedAxes(): Axis[];
  getAxisFromIndex(index: number): Axis | undefined;
  isAxisSelected(axis: Axis): boolean;
}
