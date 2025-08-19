/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  get,
} from 'svelte/store';
import FilterTypes, { FilterType } from './FilterTypes';
import Logger from '../utils/Logger';
import type { Filter } from './Filter';
import FilterGraphLimits from '../utils/FilterLimits';
import type { Vector } from './Vector';
import BaseVector from './BaseVector';

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

  public computeNormalized(values: number[]): number[] {
    return get(this.filters).map(filter => {
      return this.normalizeFilterResult(filter.filter(values), filter);
    });
  }

  private normalizeFilterResult(value: number, filter: Filter): number {
    const { min, max } = FilterGraphLimits.getFilterLimits(filter);
    const newMin = 0;
    const newMax = 1;
    const existingMin = min;
    const existingMax = max;
    return (
      ((newMax - newMin) * (value - existingMin)) / (existingMax - existingMin) + newMin
    );
  }

  public set(filterTypes: FilterType[]) {
    const newFilters = filterTypes.map(filterType =>
      FilterTypes.createFilter(filterType),
    );
    Logger.log('Setting filter ', newFilters);
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
    Logger.log('Filters', 'added filter ', filter);
  }

  public has(filterType: FilterType): boolean {
    return get(this.filters).filter(filter => filter.getType() === filterType).length > 0;
  }

  public remove(filterType: FilterType) {
    this.filters.set([
      ...get(this.filters).filter(filter => filter.getType() != filterType),
    ]);
  }

  public clear() {
    this.filters.set([]);
  }

  public count(): number {
    return get(this.filters).length;
  }
}

export default Filters;
