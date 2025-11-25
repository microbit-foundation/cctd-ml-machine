/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from '../../vector/Vector';

export type LabelledPoint = {
  classIndex: number;
  vector: Vector;
};
