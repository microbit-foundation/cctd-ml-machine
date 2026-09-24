/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { t } from 'svelte-i18n';
import FilterWithMaths from './FilterWithMaths';
import { get } from 'svelte/store';
import { FilterType } from '../Filter';

class MeanFilter extends FilterWithMaths {
  public getType(): FilterType {
    return FilterType.MEAN;
  }
  public filter(inValues: number[]): number {
    return this.mean(inValues);
  }

  public getDescription(): string {
    return get(t)('content.filters.mean.description');
  }

  public getName(): string {
    return get(t)('content.filters.mean.title');
  }

  public getMinNumberOfSamples(): number {
    return 1;
  }
}

export default MeanFilter;
