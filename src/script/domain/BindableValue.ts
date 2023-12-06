/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { Readable, Subscriber, Unsubscriber, Updater, Writable, get } from 'svelte/store';

/**
 * Bindable value is a wrapper that is useful when you want to allow binding of variables in custom stores.
 *
 * The following is an example of how to use it to allow binding of the name of gestures.
 *
 * ```ts
 * public bindName(): BindableValue<string> {
 *   const setter = (val: string) => this.setName(val);
 *   const bindable = new BindableValue(
 *      setter,
 *      derived(this.store, s => s.name),
 *   );
 *   return bindable;
 * }
 * ```
 */
class BindableValue<T> implements Writable<T> {
  /**
   * The setter is the function that will be used when the bound variable receives an update instruction.
   * The subscribable is the store that will be used as data source
   */
  constructor(
    private setter: (newValue: T) => void,
    private subscribable: Readable<T>,
  ) {}
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
