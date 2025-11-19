/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { InMemoryLiveDataStore } from "../../core/InMemoryLiveDataStore";
import type { TimestampedData } from "../../core/LiveDataBuffer";
import type { LiveDataStore } from "../../core/LiveDataStore";
import type { LiveDataVector } from "../../core/vector/LiveDataVector";
import type { LiveData } from "../../lib/domain/stores/LiveData";
import type { LiveDataRepository } from "../domain/LiveDataRepository";
import type { AbstractState } from "../interface-adapter/AbstractState";


export class InMemoryLiveDataRepository implements LiveDataRepository {
    private store: LiveDataStore<LiveDataVector>

    constructor(liveDataStoreBufferSize: number, private liveDataState: AbstractState<LiveData<LiveDataVector>>) {
        this.store = new InMemoryLiveDataStore(liveDataStoreBufferSize);
    }

    getSeries(time: number, noOfElements: number): TimestampedData<LiveDataVector>[] {
        return this.store.getBuffer().getSeries(time, noOfElements);
    }

    addInput(data: LiveDataVector): void {
        this.store.put(data);
        this.liveDataState.get().put(data);
    }

}

