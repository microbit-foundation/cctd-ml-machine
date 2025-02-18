/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Vector } from "../Vector";

export interface LiveDataVector extends Vector {
  getLabels(): string[];
}
