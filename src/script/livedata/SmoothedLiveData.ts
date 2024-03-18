/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Subscriber, Unsubscriber, derived } from 'svelte/store';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import { smoothNewValue } from '../utils/graphUtils';
import LiveData from '../domain/stores/LiveData';

/**
 * Uses interpolation to produce a 'smoothed' representation of a live data object.
 *
 * Each entry in the SmoothedLiveData will be interpolated with previous values seen. I.e `y_i = 0.75x_(i-1) + 0.25x_i`
 */
class SmoothedLiveData<T> implements LiveData<T> {
  private smoothedStore: Readable<T>;

  /**
   * Creates a new SmoothedLiveData store, using the provided LiveData store as data reference.
   * @param noOfSamples The number of samples to interpolate over
   */
  constructor(
    private referenceStore: LiveData<T>,
    private noOfSamples: number,
  ) {
    this.smoothedStore = this.deriveStore();
  }

  /**
   * Inserts a data point into the reference LiveData store.
   */
  public put(data: T): void {
    this.referenceStore.put(data);
  }

  /**
   * Throws an error. SmoothedLiveData wraps a LivedData object, if you wan't the buffer, please use the inner LiveData object
   */
  public getBuffer(): LiveDataBuffer<T> {
    throw new Error(
      "Method not implemented. Maybe it shouldn't be, what buffer are you expecting? Is it the buffer for the reference store, which do not contain smoothed data? Or do you expect a buffer for smoothed data as well? Please do write on the github issues, if the need arises",
    );
  }

  /**
   * Returns the series size of the refence LiveData store.
   */
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
   * Returns the labels associated with the refence store.
   */
  public getLabels(): string[] {
    return this.referenceStore.getLabels();
  }

  public getPropertyNames(): string[] {
    return this.referenceStore.getPropertyNames();
  }

  /**
   * Uses the buffer of the original store to derive a store with smoothed values when subscribing
   */
  private deriveStore() {
    return derived([this.referenceStore], stores => {
      const referenceData = stores[0];

      const oldValues = this.referenceStore.getBuffer().getNewestValues(this.noOfSamples);
      if (oldValues.some(val => val === null)) {
        // Theres not enough data in the buffer yet.
        return referenceData;
      }

      const newObject: T = { ...referenceData }; // transpose
      for (const property in newObject) {
        const values = oldValues.map(val => val![property] as number);
        newObject[property] = smoothNewValue(...values) as never;
      }
      return newObject;
    });
  }
}

export default SmoothedLiveData;
