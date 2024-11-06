/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, Unsubscriber, writable, Writable } from 'svelte/store';
import Classifier from '../domain/stores/Classifier';
import { Subscriber } from 'svelte/motion';

class HighlightedAxis implements Writable<number | undefined> {
  private value: Writable<number | undefined>;

  public constructor(private classifier: Classifier) {
    this.value = writable(undefined);
  }

  public set(value: number | undefined): void {
    if (get(this.value) !== value) {
      this.untrainModel();
    }
    this.value.set(value);
  }

  public update(updater: (state: number | undefined) => number | undefined): void {
    const beforeValue = get(this.value);
    const updatedValue = updater(beforeValue);
    if (beforeValue === updatedValue) {
      this.untrainModel();
    }
  }
  public subscribe(
    run: Subscriber<number | undefined>,
    invalidate?: (value?: number | undefined) => void,
  ): Unsubscriber {
    return this.value.subscribe(run, invalidate);
  }

  private untrainModel() {
    this.classifier.getModel().markAsUntrained();
  }
}

export default HighlightedAxis;
