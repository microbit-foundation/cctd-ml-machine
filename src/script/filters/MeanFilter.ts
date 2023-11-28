/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import FilterWithMaths from './FilterWithMaths';

class MeanFilter extends FilterWithMaths {
  public filter(inValues: number[]): number {
    return this.mean(inValues);
  }
}

export default MeanFilter;
