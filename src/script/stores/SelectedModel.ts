/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { Invalidator, Subscriber, Unsubscriber, Writable } from "svelte/store";
import ModelRegistry, { ModelInfo } from "../domain/ModelRegistry";
import PersistantWritable from "../repository/PersistantWritable";

class SelectedModel implements Writable<ModelInfo> {
    private store: Writable<ModelInfo>
    public constructor() {
        this.store = new PersistantWritable<ModelInfo>(
            ModelRegistry.NeuralNetwork,
            'selectedModel',
        );
    }

    public set(value: ModelInfo): void {
        this.store.set(value);
    }

    public update(updater: (state: ModelInfo) => ModelInfo): void {
        this.store.update(updater);        
    }

    public subscribe(run: Subscriber<ModelInfo>, invalidate?: Invalidator<ModelInfo>): Unsubscriber {
        return this.store.subscribe(run, invalidate);
    }
}

export default SelectedModel;