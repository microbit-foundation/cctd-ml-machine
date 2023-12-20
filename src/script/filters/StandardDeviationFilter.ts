/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import { FilterType } from '../domain/FilterTypes';
import FilterWithMaths from './FilterWithMaths';
import { t } from 'svelte-i18n';

class StandardDeviationFilter extends FilterWithMaths {
  public getType(): FilterType {
    return FilterType.STD;
  }
  public filter(inValues: number[]): number {
    const mean = this.mean(inValues);
    return Math.sqrt(
      inValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / inValues.length,
    );
  }

  public getName(): string {
    return get(t)('content.filters.std.title');
  }

  public getDescription(): string {
    return get(t)('content.filters.std.description');
  }
}

export default StandardDeviationFilter;
