/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from "../../core/entities/Axis";
import type { AbstractState } from "./AbstractState";

export interface DataService {
    getSelectedAxes(): AbstractState<Axis[]>
}
