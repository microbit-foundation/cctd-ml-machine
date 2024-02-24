/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Filter from '../domain/Filter';
import { FilterType } from '../domain/FilterTypes';

abstract class FilterWithMaths implements Filter {
  abstract filter(inValues: number[]): number;

  abstract getType(): FilterType;

  abstract getName(): string;

  abstract getDescription(): string;

  protected stddev(arr: number[]): number {
    const arr_mean = this.mean(arr);
    const r = (acc: number, val: number) => {
      return acc + (val - arr_mean) * (val - arr_mean);
    };
    return Math.sqrt(arr.reduce(r, 0.0) / arr.length);
  }

  protected mean(inValues: number[]): number {
    return inValues.reduce((acc, val) => acc + val, 0) / inValues.length;
  }
}

export default FilterWithMaths;
