import { Readable, Subscriber, Unsubscriber, derived } from 'svelte/store';
import LiveData from '../domain/LiveData';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import { smoothNewValue } from '../utils/graphUtils';

class SmoothedLiveData<T> implements LiveData<T> {
  private smoothedStore: Readable<T>;

  constructor(private referenceStore: LiveData<T>) {
    this.smoothedStore = this.deriveStore();
  }

  public put(data: T): void {
    this.referenceStore.put(data);
  }

  public getBuffer(): LiveDataBuffer<T> {
    throw new Error(
      "Method not implemented. Maybe it shouldn't be, what buffer are you expecting? Is it the buffer for the reference store, which do not contain smoothed data? Or do you expect a buffer for smoothed data as well? Please do write on the github issues, if the need arises",
    );
  }

  public getSeriesSize(): number {
    return this.referenceStore.getSeriesSize();
  }

  public subscribe(
    run: Subscriber<T>,
    invalidate?: ((value?: T | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.smoothedStore.subscribe(run, invalidate);
  }

  /**
   * Uses the buffer of the original store to derive a store with smoothed values when subscribing
   */
  private deriveStore() {
    return derived([this.referenceStore], stores => {
      const referenceData = stores[0];
      const oldValues = this.referenceStore.getBuffer().getNewestValues(2);
      if (oldValues.some(val => val === null)) {
        return referenceData;
      }
      const newObject: T = { ...referenceData };
      for (const property in newObject) {
        const firstValue: T = oldValues[0] as T;
        const secondValue: T = oldValues[1] as T;
        newObject[property] = smoothNewValue(
          firstValue[property] as number,
          secondValue[property] as number,
        ) as never;
      }
      return newObject;
    });
  }
}

export default SmoothedLiveData;
