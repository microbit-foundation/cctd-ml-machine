/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  writable,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';

class Snackbar implements Readable<string | undefined> {
  private store: Writable<string | undefined>;
  private timeout: NodeJS.Timeout | undefined;

  constructor() {
    this.store = writable(undefined);
  }

  public subscribe(
    run: Subscriber<string | undefined>,
    invalidate?: Invalidator<string | undefined> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public clearMessaage() {
    this.store.set(undefined);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public sendMessage(message: string, duration: number = 4000) {
    this.store.set(message);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.store.set(undefined);
    }, duration);
  }
}

export default Snackbar;
