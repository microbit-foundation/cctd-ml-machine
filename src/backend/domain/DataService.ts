/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';

export interface DataService {
  addLiveData(input: LiveDataVector): void;
  setSelectedAxes(axes: Axis[]): void;
  toggleAxis(axis: Axis): void;
  getAvailableAxes(): Axis[];
  getSelectedAxes(): Axis[];
  getAxisFromIndex(index: number): Axis | undefined;
  isAxisSelected(axis: Axis): boolean;
}
