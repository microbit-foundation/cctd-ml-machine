/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from "../../../../core/entities/Axis";
import type { AbstractState } from "../../AbstractState";
import type { DataService } from "../../DataService";

export class StateDataService implements DataService {
    constructor(private selectedAxes: AbstractState<Axis[]>) { }

    getSelectedAxes(): AbstractState<Axis[]> {
        return this.selectedAxes;
    }

}
