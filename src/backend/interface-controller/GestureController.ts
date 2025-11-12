/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Gesture, GestureID } from "../../core/entities/Gesture";
import type { AbstractState } from "../domain/AbstractState";
import type { GestureService } from "../domain/GestureService";

export class GestureController {

    public constructor(
        private gestures: AbstractState<Gesture[]>,
        private gestureService: GestureService
    ) {

    }

    public getGestures(): AbstractState<Gesture[]> {
        return this.gestures;
    }

    public getGesture(id: GestureID): Gesture | undefined {
        return this.gestureService.getGesture(id);
    }

    public clearGestures() {
        this.gestures.set([])
    }
}
