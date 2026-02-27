/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import { t } from 'svelte-i18n';
import { FilterType, type Filter } from '../Filter';

class MaxFilter implements Filter {
  public getName(): string {
    return get(t)('content.filters.max.title');
  }
  public getDescription(): string {
    return get(t)('content.filters.max.description');
  }
  public getType(): FilterType {
    return FilterType.MAX;
  }
  public filter(inValues: number[]): number {
    return Math.max(...inValues);
  }
  public getMinNumberOfSamples(): number {
    return 1;
  }
}
export default MaxFilter;
