/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { NewGesture } from '../../core/entities/NewGesture';

export interface AxisRepository {
  setSelectedAxes(axes: Axis[]): void;
  getSelectedAxes(): Axis[];
  getAvailableAxes(): Axis[];
  setAvailableAxes(axes: Axis[]): void;
}
