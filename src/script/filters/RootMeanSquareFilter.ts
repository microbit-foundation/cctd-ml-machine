/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import Filter from '../domain/Filter';
import { FilterType } from '../domain/FilterTypes';
import { t } from 'svelte-i18n';

class RootMeanSquareFilter implements Filter {
  public getName(): string {
    return get(t)('content.filters.rms.title');
  }
  public getDescription(): string {
    return get(t)('content.filters.rms.description');
  }
  public getType(): FilterType {
    return FilterType.RMS;
  }

  public filter(inValues: number[]): number {
    return Math.sqrt(inValues.reduce((a, b) => a + Math.pow(b, 2), 0) / inValues.length);
  }
}

export default RootMeanSquareFilter;
