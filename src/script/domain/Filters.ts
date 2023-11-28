/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Subscriber, Unsubscriber, Writable, get } from 'svelte/store';
import Filter from './Filter';

class Filters implements Readable<Filter[]> {
  constructor(private filters: Writable<Filter[]>) {}
  public subscribe(
    run: Subscriber<Filter[]>,
    invalidate?: ((value?: Filter[] | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.filters.subscribe(run, invalidate);
  }

  public compute(values: number[]): number[] {
    return get(this.filters).map(filter => {
      return filter.filter(values);
    });
  }

  public count(): number {
    return get(this.filters).length;
  }
}

export default Filters;
