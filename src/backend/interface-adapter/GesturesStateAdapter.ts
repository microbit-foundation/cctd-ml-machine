/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable, type Writable } from "svelte/store";
import type { Gesture } from "../../core/entities/Gesture";
import type { AbstractState, Unsubscriber } from "../domain/AbstractState";
import type { GestureService } from "../domain/GestureService";


export class GesturesStateAdapter implements AbstractState<Gesture[]> {

    private gestures: Writable<Gesture[]>;

    public constructor(
        private gestureService: GestureService
    ) {
        this.gestures = writable(gestureService.getGestures());
    }

    public get(): Gesture[] {
        return this.gestureService.getGestures();
    }
    
    public set(value: Gesture[]): void {
        this.gestures.set(value);
        return this.gestureService.setGestures(value);
    }

    public update(updater: (currentValue: Gesture[]) => Gesture[]): void {
        this.gestures.update(updater);
        this.gestureService.setGestures(
            get(this.gestures)
        );
    }
    public subscribe(run: (value: Gesture[]) => void, invalidate?: ((value?: Gesture[] | undefined) => void) | undefined): Unsubscriber {
        return this.gestures.subscribe(run, invalidate);
    }

}

