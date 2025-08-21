/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  derived,
  get,
  writable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';

class EnableFingerprint implements Writable<boolean> {
  private value: Writable<boolean>;

  public constructor(defaultValue: boolean) {
    this.value = writable(defaultValue);
  }

  public set(newValue: boolean): void {
    this.value.set(newValue);
  }

  public update(updater: (state: boolean) => boolean): void {
    const beforeValue = get(this.value);
    const updatedValue = updater(beforeValue);
    this.set(updatedValue);
  }

  public subscribe(
    run: Subscriber<boolean>,
    invalidate?: (value?: boolean) => void,
  ): Unsubscriber {
    return derived([this.value], ([store]) => store).subscribe(run, invalidate);
  }
}

export default EnableFingerprint;
