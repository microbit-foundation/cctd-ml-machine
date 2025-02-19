import { type Subscriber, type Invalidator, type Unsubscriber, type Writable, writable } from "svelte/store";
import type LiveDataBuffer from "../domain/LiveDataBuffer";
import type { LiveData } from "../domain/stores/LiveData";
import type { LiveDataVector } from "../domain/stores/LiveDataVector";
import { MicrobitAccelerometerDataVector } from "./MicrobitAccelerometerData";

class PredictedPointLiveData implements LiveData<LiveDataVector> {
    private store: Writable<LiveDataVector>;
    constructor(private dataBuffer: LiveDataBuffer<LiveDataVector>) {
        this.store = writable(
            new MicrobitAccelerometerDataVector({
                x: 0,
                y: 0,
                z: 0,
            }),
        );
    }
    public put(data: LiveDataVector): void {
        this.store.set(data);
        this.dataBuffer.addValue(data);
    }
    public getBuffer(): LiveDataBuffer<LiveDataVector> {
        return this.dataBuffer;
    }
    public getSeriesSize(): number {
        return 3;
    }
    public getLabels(): string[] {
        return []
    }
    public subscribe(run: Subscriber<LiveDataVector>, invalidate?: Invalidator<LiveDataVector> | undefined): Unsubscriber {
        return this.store.subscribe(run, invalidate)
    }
}

export default PredictedPointLiveData;