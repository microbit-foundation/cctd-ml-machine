/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from "../../core/entities/Axis";
import type { AbstractState } from "../domain/AbstractState";
import type { MLMachine } from "../interface-adapter/MLMachine";


export class AxisController {
    constructor(
        private mlMachine: MLMachine,
    ) {
    }

    public getSelectedAxes(): AbstractState<Axis[]> {
        return this.mlMachine.getDataService().getSelectedAxes();
    }
}