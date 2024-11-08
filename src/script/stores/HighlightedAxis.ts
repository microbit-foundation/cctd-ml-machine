/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, Unsubscriber, writable, Writable } from 'svelte/store';
import Classifier from '../domain/stores/Classifier';
import { Subscriber } from 'svelte/motion';
import SelectedModel from './SelectedModel';
import ModelRegistry from '../domain/ModelRegistry';

class HighlightedAxis implements Writable<number | undefined> {
  private value: Writable<number | undefined>;

  public constructor(private classifier: Classifier, private selectedModel: SelectedModel) {
    this.value = writable(undefined);
  }

  public set(value: number | undefined): void {
    if (get(this.value) !== value) {
      this.onChangedAxis();
    }
    this.value.set(value);
  }

  public update(updater: (state: number | undefined) => number | undefined): void {
    const beforeValue = get(this.value);
    const updatedValue = updater(beforeValue);
    if (beforeValue === updatedValue) {
      this.onChangedAxis();
    }
  }
  public subscribe(
    run: Subscriber<number | undefined>,
    invalidate?: (value?: number | undefined) => void,
  ): Unsubscriber {
    return this.value.subscribe(run, invalidate);
  }

  /**
   * When the axis that has been selected is EXPLICITLY different from before
   */
  private onChangedAxis() {
    this.classifier.getModel().markAsUntrained();
    if (get(this.selectedModel).id === ModelRegistry.KNN.id) {
        console.error("Not implemented, should retrain model now! Need repository for training data")
    }
  }
}

export default HighlightedAxis;
