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
  get,
  writable,
} from 'svelte/store';
import { GestureID } from './gesture/Gesture';

type GestureConfidenceMap = Map<GestureID, number>;

class Confidences implements Readable<GestureConfidenceMap> {
  private confidenceStore: Writable<GestureConfidenceMap>;

  constructor() {
    this.confidenceStore = writable(new Map<GestureID, number>());
  }

  public subscribe(
    run: Subscriber<GestureConfidenceMap>,
    invalidate?: ((value?: GestureConfidenceMap | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.confidenceStore.subscribe(run, invalidate);
  }

  public setConfidence(gestureId: GestureID, confidence: number): void {
    this.confidenceStore.update((map: GestureConfidenceMap) => {
      map.set(gestureId, confidence);
      return map;
    });
  }

  public getConfidence(gestureId: GestureID): number {
    const confidence = get(this.confidenceStore).get(gestureId);
    if (confidence === undefined) {
      throw new Error(`No confidence value found for gesture with ID ${gestureId}`);
    }
    return confidence;
  }
}

export default Confidences;
