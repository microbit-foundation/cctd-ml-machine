/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  derived,
  get,
  writable,
} from 'svelte/store';
import type { Confidence } from '../../../../core/entities/Confidence';

/**
 * @deprecated Replace with only the required confidence as a setting. Use Confidences from the ConfidenceService instead.
 */
class GestureConfidence implements Readable<Confidence> {
  private requiredConfidence: Writable<number>;

  private store: Readable<Confidence>;

  constructor(
    requiredConfidence: number,
    private confidence: Readable<number>,
  ) {
    /**/
    this.requiredConfidence = writable(requiredConfidence);
    this.store = this.deriveStore();
  }

  public subscribe(
    run: Subscriber<Confidence>,
    invalidate?: ((value?: Confidence | undefined) => void) | undefined,
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

  private deriveStore(): Readable<Confidence> {
    return derived([this.confidence, this.requiredConfidence], stores => {
      return {
        currentConfidence: stores[0],
        requiredConfidence: stores[1],
        isConfident: stores[0] > stores[1],
      };
    });
  }
}

export default GestureConfidence;
