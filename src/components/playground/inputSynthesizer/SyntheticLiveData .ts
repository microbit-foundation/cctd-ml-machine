import { Subscriber, Invalidator, Unsubscriber, Writable, writable, get } from "svelte/store";
import LiveDataBuffer from "../../../script/domain/LiveDataBuffer";
import LiveData from "../../../script/domain/stores/LiveData";
import { LiveDataVector } from "../../../script/domain/stores/LiveDataVector";
import BaseVector from "../../../script/livedata/BaseVector";
import { lab } from "d3";

export class SyntheticLiveData implements LiveData<BaseVector> {
    private store: Writable<BaseVector>;
    private buffer: LiveDataBuffer<BaseVector>
    public constructor(labels: string[]) {
        this.store = writable(new BaseVector(new Array(labels.length).fill(0), labels))
        this.buffer = new LiveDataBuffer(200);
    }
    put(data: BaseVector): void {
        this.store.set(data);
        this.buffer.addValue(data);
    }
    getBuffer(): LiveDataBuffer<BaseVector> {
        return this.buffer;
    }
    getSeriesSize(): number {
        return get(this.store).getSize();
    }
    getLabels(): string[] {
        return get(this.store).getLabels();
    }
    subscribe(run: Subscriber<BaseVector>, invalidate?: Invalidator<BaseVector> | undefined): Unsubscriber {
        return this.store.subscribe(run, invalidate);
    }

}