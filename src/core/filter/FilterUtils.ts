/**
 * (c) 2023-2025, center for computational thinking and design at aarhus university and contributors
 *
 * spdx-license-identifier: mit
 */

import { FilterType, type Filter } from './Filter';
import MaxFilter from './filters/MaxFilter';
import MeanFilter from './filters/MeanFilter';
import MinFilter from './filters/MinFilter';
import PeaksFilter from './filters/PeaksFilter';
import RootMeanSquareFilter from './filters/RootMeanSquareFilter';
import StandardDeviationFilter from './filters/StandardDeviationFilter';
import TotalAccFilter from './filters/TotalAccFilter';
import ZeroCrossingRateFilter from './filters/ZeroCrossingRateFilter';

export const createFilter = (type: FilterType): Filter => {
  switch (type) {
    case FilterType.MAX:
      return new MaxFilter();
    case FilterType.MIN:
      return new MinFilter();
    case FilterType.MEAN:
      return new MeanFilter();
    case FilterType.STD:
      return new StandardDeviationFilter();
    case FilterType.PEAKS:
      return new PeaksFilter();
    case FilterType.ACC:
      return new TotalAccFilter();
    case FilterType.ZCR:
      return new ZeroCrossingRateFilter();
    case FilterType.RMS:
      return new RootMeanSquareFilter();
    default:
      throw new Error(`Unknown filter type '${type as string}'`);
  }
};

export const getFilterTypes = (): FilterType[] => {
  return Object.values(FilterType).filter(
    value => typeof value === 'number',
  ) as FilterType[];
};
