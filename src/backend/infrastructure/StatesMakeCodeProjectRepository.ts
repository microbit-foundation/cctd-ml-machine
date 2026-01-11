/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MakeCodeProject } from "@microbit/makecode-embed";
import type { AbstractState } from "../statemanagement/AbstractState";
import type { AbstractStates } from "../statemanagement/AbstractStates";


export class StatesMakeCodeProjectRepository {

    public constructor(private states: AbstractStates) {}

    public getMakeCodeProject(): AbstractState<MakeCodeProject | undefined> {
        return this.states.getMakeCodeProject();
    }
}