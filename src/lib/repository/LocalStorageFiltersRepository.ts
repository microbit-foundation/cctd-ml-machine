/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { derived, get, type Writable } from 'svelte/store';
import type { FiltersRepository } from '../domain/FiltersRepository';
import FilterTypes from '../domain/FilterTypes';
import PersistantWritable from './PersistantWritable';
import type { Filter } from '../domain/Filter';
import Filters from '../domain/Filters';

export class LocalStorageFiltersRepository implements FiltersRepository {
  private filters: Filters;

  public constructor() {
    this.filters = new Filters(this.deriveStore());
  }

  private deriveStore(): Writable<Filter[]> {
    // Create and fetch a persistant store
    const persistedStore = new PersistantWritable(FilterTypes.toIterable(), 'filters');
    const derivedStore = derived([persistedStore], stores => {
      const persistedFilters = stores[0];
      return persistedFilters.map(persistedFilter =>
        FilterTypes.createFilter(persistedFilter),
      );
    });
    // Convert a store of type 'FilterType' to type 'filter'.
    return {
      subscribe: derivedStore.subscribe,
      set: newFiltersArray =>
        persistedStore.set(newFiltersArray.map(newFilter => newFilter.getType())),
      update: updater => {
        const updatedStore = updater(get(derivedStore)).map(filter => filter.getType());
        persistedStore.set(updatedStore);
      },
    };
  }

  public getFilters(): Filters {
    return this.filters;
  }
}
