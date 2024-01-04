/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Filter from '../domain/Filter';
import { FilterType } from '../domain/FilterTypes';

export type FilterGraphType = {
  min: number;
  max: number;
};

class FilterGraphLimits {
  public static getFilterLimits(filter: Filter): { min: number; max: number } {
    const filterType = filter.getType();
    switch (filterType) {
      case FilterType.MAX:
        return { min: -2.4, max: 2.4 };
      case FilterType.MIN:
        return { min: -2.4, max: 2.4 };
      case FilterType.STD:
        return { min: 0, max: 2.4 };
      case FilterType.PEAKS:
        return { min: 0, max: 10 };
      case FilterType.ACC:
        return { min: 0, max: 160 };
      case FilterType.MEAN:
        return { min: -2.4, max: 2.4 };
      case FilterType.ZCR:
        return { min: 0, max: 1 };
      case FilterType.RMS:
        return { min: 0, max: 2 };
    }
  }
}

export default FilterGraphLimits;
