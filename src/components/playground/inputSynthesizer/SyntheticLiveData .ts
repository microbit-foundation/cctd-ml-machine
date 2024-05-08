import { Subscriber, Invalidator, Unsubscriber, Writable, writable, get } from "svelte/store";
import LiveDataBuffer from "../../../script/domain/LiveDataBuffer";
import LiveData from "../../../script/domain/stores/LiveData";
import { LiveDataVector } from "../../../script/domain/stores/LiveDataVector";
import BaseVector from "../../../script/livedata/BaseVector";

export class Synthetic5AxisData implements LiveDataVector {
    public constructor(private base: BaseVector) {
    }

    getVector(): number[] {
        return this.base.getVector();
    }
    getSize(): number {
        return this.base.getSize();
    }
    getLabels(): string[] {
        return this.base.getLabels();
    }

}

export class SyntheticLiveData implements LiveData<Synthetic5AxisData> {
    private store: Writable<Synthetic5AxisData>;
    private buffer: LiveDataBuffer<Synthetic5AxisData>
    public constructor() {
        this.store = writable(new Synthetic5AxisData(new BaseVector([0, 0, 0, 0, 0], ["A", "B", "C", "D", "F"])))
        this.buffer = new LiveDataBuffer(200);
    }
    put(data: Synthetic5AxisData): void {
        this.store.set(data);
        this.buffer.addValue(data);
    }
    getBuffer(): LiveDataBuffer<Synthetic5AxisData> {
        return this.buffer;
    }
    getSeriesSize(): number {
        return get(this.store).getSize();
    }
    getLabels(): string[] {
        return get(this.store).getLabels();
    }
    subscribe(run: Subscriber<Synthetic5AxisData>, invalidate?: Invalidator<Synthetic5AxisData> | undefined): Unsubscriber {
        return this.store.subscribe(run, invalidate);
    }

}