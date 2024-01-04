/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Subscriber, Unsubscriber, Writable, get } from 'svelte/store';
import Filter from './Filter';
import FilterTypes, { FilterType } from './FilterTypes';

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

  public set(filterTypes: FilterType[]) {
    const newFilters = filterTypes.map(filterType =>
      FilterTypes.createFilter(filterType),
    );
    this.filters.set(newFilters);
  }

  public add(filterType: FilterType) {
    if (this.has(filterType)) {
      // Just a thought: Does it make sense to have duplicate filters?
      throw new Error('Cannot add filter type. Filters already has this type');
    }
    const filter = FilterTypes.createFilter(filterType);
    const oldFilterArray = [...get(this.filters)];
    this.filters.set([...oldFilterArray, filter]);
  }

  public has(filterType: FilterType): boolean {
    return get(this.filters).filter(filter => filter.getType() === filterType).length > 0;
  }

  public remove(filterType: FilterType) {
    this.filters.set([
      ...get(this.filters).filter(filter => filter.getType() != filterType),
    ]);
  }

  public count(): number {
    return get(this.filters).length;
  }
}

export default Filters;
