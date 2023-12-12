/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  Readable,
  Subscriber,
  Unsubscriber,
  Writable,
  derived,
  get,
  writable,
} from 'svelte/store';

type ConfidenceData = {
  confidence: number;
  requiredConfidence: number;
  isConfident: boolean;
};

class GestureConfidence implements Readable<ConfidenceData> {
  private requiredConfidence: Writable<number>;

  private store: Readable<ConfidenceData>;

  constructor(
    requiredConfidence: number,
    private confidence: Readable<number>,
  ) {
    /**/
    this.requiredConfidence = writable(requiredConfidence);
    this.store = this.deriveStore();
  }

  public subscribe(
    run: Subscriber<ConfidenceData>,
    invalidate?: ((value?: ConfidenceData | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public getCurrentConfidence(): number {
    return get(this.confidence);
  }

  public setRequiredConfidence(value: number) {
    if (value < 0 || value > 1) {
      throw new Error(
        'Could not set required confidence. Cannot go outside the 0.0-1.0 range',
      );
    }
    this.requiredConfidence.set(value);
  }

  public getRequiredConfidence(): number {
    return get(this.requiredConfidence);
  }

  public isConfident(): boolean {
    return this.getCurrentConfidence() > this.getRequiredConfidence();
  }

  private deriveStore(): Readable<ConfidenceData> {
    return derived([this.confidence, this.requiredConfidence], stores => {
      return {
        confidence: stores[0],
        requiredConfidence: stores[1],
        isConfident: stores[0] > stores[1],
      };
    });
  }
}

export default GestureConfidence;
