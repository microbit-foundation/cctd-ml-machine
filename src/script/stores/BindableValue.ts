/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  Readable,
  Subscriber,
  Unsubscriber,
  Updater,
  Writable,
  get,
  writable,
} from 'svelte/store';

class BindableValue<T> implements Writable<T> {
  private store: Writable<T>;

  constructor(private setter: (newValue: T) => void, private subscribable: Readable<T>) {
    this.store = writable(get(subscribable));
  }
  public set(value: T): void {
    this.setter(value);
  }
  public update(updater: Updater<T>): void {
    this.setter(updater(get(this.subscribable)));
  }
  public subscribe(
    run: Subscriber<T>,
    invalidate?: ((value?: T | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.subscribable.subscribe(run, invalidate);
  }
}

export default BindableValue;
