/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Subscriber, Unsubscriber, Writable, writable } from 'svelte/store';
export type PlaygroundContextData = {
  messages: any[];
};
class PlaygroundContext implements Readable<PlaygroundContextData> {
  private readonly LOG_LIMIT = 15;
  private store: Writable<PlaygroundContextData>;
  constructor() {
    this.store = writable({
      messages: [],
    });
  }

  public subscribe(
    run: Subscriber<PlaygroundContextData>,
    invalidate?: ((value?: PlaygroundContextData | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public addMessage(...message: any[]) {
    this.store.update(store => {
      store.messages.push([message]);
      if (store.messages.length > this.LOG_LIMIT) {
        store.messages.reverse();
        store.messages.pop();
        store.messages.reverse();
      }
      return store;
    });
  }
}

const playgroundContext = new PlaygroundContext();
export default playgroundContext;
