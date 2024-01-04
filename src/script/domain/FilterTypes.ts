/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Filter from '../domain/Filter';
import MaxFilter from '../filters/MaxFilter';
import MeanFilter from '../filters/MeanFilter';
import MinFilter from '../filters/MinFilter';
import PeaksFilter from '../filters/PeaksFilter';
import RootMeanSquareFilter from '../filters/RootMeanSquareFilter';
import StandardDeviationFilter from '../filters/StandardDeviationFilter';
import TotalAccFilter from '../filters/TotalAccFilter';
import ZeroCrossingRateFilter from '../filters/ZeroCrossingRateFilter';

export enum FilterType {
  MAX,
  MIN,
  MEAN,
  STD,
  PEAKS,
  ACC,
  ZCR,
  RMS,
}

class FilterTypes {
  public static createFilter(type: FilterType): Filter {
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
  }
  public static toIterable(): FilterType[] {
    return Object.values(FilterType).filter(
      value => typeof value === 'number',
    ) as FilterType[];
  }
}

export default FilterTypes;
