/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  Invalidator,
  Subscriber,
  Unsubscriber,
  Updater,
  Writable,
  get,
  writable,
} from 'svelte/store';
import ControlledStorage from '../ControlledStorage';

class PersistantWritable<T> implements Writable<T> {
  private store: Writable<T>;

  constructor(
    initialValue: T,
    private key: string,
  ) {
    if (ControlledStorage.has(key)) {
      const storedValue = ControlledStorage.get<T>(key);
      this.store = writable(storedValue);
    } else {
      this.store = writable(initialValue);
      this.saveToLocalStorage();
    }
  }

  public set(value: T): void {
    this.store.set(value);
    this.saveToLocalStorage();
  }

  public update(updater: Updater<T>): void {
    this.store.update(updater);
    this.saveToLocalStorage();
  }

  public subscribe(
    run: Subscriber<T>,
    invalidate?: Invalidator<T> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  private saveToLocalStorage() {
    ControlledStorage.set<T>(this.key, get(this.store));
  }
}

export default PersistantWritable;
