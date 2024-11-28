/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, type Unsubscriber, writable, type Writable } from 'svelte/store';
import Classifier from './Classifier';
import { type Subscriber } from 'svelte/motion';
import SelectedModel from '../../stores/SelectedModel';
import ModelRegistry from '../ModelRegistry';
import type { Axis } from '../Axis';

class HighlightedAxes implements Writable<Axis[]> {
  private value: Writable<Axis[]>;

  public constructor(
    private classifier: Classifier,
    private selectedModel: SelectedModel,
  ) {
    this.value = writable([]);
  }

  public set(value: Axis[]): void {
    if (get(this.value) !== value) {
      this.onChangedAxis();
    }
    this.value.set(value);
  }

  public update(updater: (state: Axis[]) => Axis[]): void {
    const beforeValue = get(this.value);
    const updatedValue = updater(beforeValue);
    if (beforeValue === updatedValue) {
      this.onChangedAxis();
    }
  }

  public subscribe(
    run: Subscriber<Axis[]>,
    invalidate?: (value?: Axis[]) => void,
  ): Unsubscriber {
    return this.value.subscribe(run, invalidate);
  }

  public toggleAxis(axis: Axis) {
    if (
      !!get(this.value).find(val => val.label === axis.label && val.index === axis.index)
    ) {
      this.value.set(get(this.value).filter(e => e.index !== axis.index));
    } else {
      this.value.set([...get(this.value), axis]);
    }
  }

  public isAxisHighlighted(axis: Axis) {
    return !!get(this.value).find(e => e.index === axis.index && e.label === axis.label);
  }

  public isAxisIndexHighlighted(index: number) {
    return !!get(this.value).find(e => e.index === index);
  }
  /**
   * When the axis that has been selected is EXPLICITLY different from before
   */
  private onChangedAxis() {
    this.classifier.getModel().markAsUntrained();
    if (get(this.selectedModel).id === ModelRegistry.KNN.id) {
      console.error(
        'Not implemented, should retrain model now! Need repository for training data',
      );
    }
  }
}

export default HighlightedAxes;
