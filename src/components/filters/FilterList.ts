/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { FilterType } from '../../script/domain/FilterTypes';
import { stores } from '../../script/stores/Stores';

export const toggleFilterCheckmarkClickHandler =
  (filterType: FilterType) => (e: MouseEvent) => {
    e.preventDefault();
    const selectedFilters = stores.getClassifier().getFilters();
    selectedFilters.has(filterType)
      ? selectedFilters.remove(filterType)
      : selectedFilters.add(filterType);
  };
