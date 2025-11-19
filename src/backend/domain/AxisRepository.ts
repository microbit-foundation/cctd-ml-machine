/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from "../../core/entities/Axis";


export interface AxisRepository {
    setSelectedAxes(axes: Axis[]): void;
    getSelectedAxes(): Axis[];
    getAvailableAxes(): Axis[];
}

