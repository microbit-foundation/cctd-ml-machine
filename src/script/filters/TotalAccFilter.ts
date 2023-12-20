/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import Filter from '../domain/Filter';
import { FilterType } from '../domain/FilterTypes';
import { t } from 'svelte-i18n';

class TotalAccFilter implements Filter {
  public getName(): string {
    return get(t)('content.filters.acc.title');
  }
  public getDescription(): string {
    return get(t)('content.filters.acc.description');
  }
  public getType(): FilterType {
    return FilterType.ACC;
  }
  public filter(inValues: number[]): number {
    return inValues.reduce((a, b) => a + Math.abs(b));
  }
}

export default TotalAccFilter;
