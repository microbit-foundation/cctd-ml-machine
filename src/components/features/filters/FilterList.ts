/**
 * (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { writable } from 'svelte/store';
import { FilterType } from '../../../lib/domain/FilterTypes';
import { stores } from '../../../lib/stores/Stores';

export const toggleFilterCheckmarkClickHandler =
  (filterType: FilterType) => (e: MouseEvent) => {
    e.preventDefault();
    const selectedFilters = stores.getClassifier().getFilters();
    selectedFilters.has(filterType)
      ? selectedFilters.remove(filterType)
      : selectedFilters.add(filterType);
  };

export const highlightedFilter = writable<FilterType>(FilterType.MAX);
export const showHighlighted = writable<boolean>(false);
export const anchorElement = writable<HTMLElement | null>(null);
