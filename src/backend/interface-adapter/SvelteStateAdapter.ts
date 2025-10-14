/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */


import { get, type Invalidator, type Subscriber, type Unsubscriber, type Writable } from "svelte/store";
import type { AbstractState } from "../application/data/AbstractState";

export class SvelteStateAdapter<T> implements AbstractState<T>, Writable<T> {
    constructor(private svelteState: Writable<T>) { }

    public get(): T {
        return get(this.svelteState);
    }

    public set(value: T): void {
        return this.svelteState.set(value);
    }

    public update(updater: (currentValue: T) => T): void {
        return this.svelteState.update(updater);
    }

    public subscribe(run: Subscriber<T>, invalidate?: Invalidator<T> | undefined): Unsubscriber {
        return this.svelteState.subscribe(run, invalidate);
    }
}