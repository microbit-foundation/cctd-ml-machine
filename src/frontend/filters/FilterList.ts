/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { writable } from 'svelte/store';
import { FilterType } from '../../core/filter/Filter';
import { getControllers } from '../../backend/interface-adapter/MLMachine';

export const toggleFilterCheckmarkClickHandler =
  (filterType: FilterType) => (e: MouseEvent) => {
    e.preventDefault();
    getControllers().getFilterController().toggleFilter(filterType);
  };

export const highlightedFilter = writable<FilterType>(FilterType.MAX);
export const showHighlighted = writable<boolean>(false);
export const anchorElement = writable<HTMLElement | null>(null);
