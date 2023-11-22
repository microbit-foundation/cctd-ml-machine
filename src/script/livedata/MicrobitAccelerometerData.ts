import { Subscriber, Unsubscriber, Writable, writable } from 'svelte/store';
import LiveData from '../domain/LiveData';

export type MicrobitAccelerometerData = {
  accelX: number;
  accelY: number;
  accelZ: number;
  smoothedAccelX: number;
  smoothedAccelY: number;
  smoothedAccelZ: number;
};

class MicrobitAccelerometerLiveData implements LiveData<MicrobitAccelerometerData> {
  private store: Writable<MicrobitAccelerometerData>;
  constructor() {
    this.store = writable({
      accelX: 0,
      accelY: 0,
      accelZ: 0,
      smoothedAccelX: 0,
      smoothedAccelY: 0,
      smoothedAccelZ: 0,
    });
  }

  put(data: MicrobitAccelerometerData): void {
    throw new Error('Method not implemented.');
  }
  
  subscribe(
    run: Subscriber<MicrobitAccelerometerData>,
    invalidate?: ((value?: MicrobitAccelerometerData | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

export default MicrobitAccelerometerLiveData;
