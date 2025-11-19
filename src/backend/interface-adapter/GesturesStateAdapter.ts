/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable, type Readable, type Writable } from "svelte/store";
import type { Gesture } from "../../core/entities/Gesture";
import type { GestureService } from "../domain/GestureService";
import type { AbstractReadonlyState, Unsubscriber } from "./AbstractReadonlyState";


export class GesturesStateAdapter implements AbstractReadonlyState<Gesture[]>, Readable<Gesture[]> {

    private gestures: Writable<Gesture[]>;

    public constructor(
        gestureService: GestureService
    ) {
        this.gestures = writable(gestureService.getGestures());
    }

    public get(): Gesture[] {
        return get(this.gestures);
    }

    public set(gestures: Gesture[]) {
        this.gestures.set(gestures);
    }

    public update(updater: (currentValue: Gesture[]) => Gesture[]): void {
        return this.gestures.update(updater);
    }

    public subscribe(run: (value: Gesture[]) => void, invalidate?: ((value?: Gesture[] | undefined) => void) | undefined): Unsubscriber {
        return this.gestures.subscribe(run, invalidate);
    }
}

