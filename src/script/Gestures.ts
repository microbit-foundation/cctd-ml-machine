/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { Writable, writable } from 'svelte/store';
import StaticConfiguration from '../StaticConfiguration';

class Gestures {
  private static confidences: Map<number, Writable<number>> = new Map();
  private static requiredConfidences: Map<number, Writable<number>> = new Map();

  public static getConfidence(ID: number): Writable<number> {
    if (!this.confidences.has(ID)) {
      this.confidences.set(ID, writable(0));
    }
    return this.confidences.get(ID)!;
  }

  public static getRequiredConfidence(ID: number): Writable<number> {
    if (!this.requiredConfidences.has(ID)) {
      this.requiredConfidences.set(
        ID,
        writable(StaticConfiguration.defaultRequiredConfidence),
      );
    }
    return this.requiredConfidences.get(ID)!;
  }
}

export default Gestures;
