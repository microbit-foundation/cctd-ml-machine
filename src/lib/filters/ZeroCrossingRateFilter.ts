/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import { FilterType } from '../domain/FilterTypes';
import { t } from 'svelte-i18n';
import type { Filter } from '../domain/Filter';

class ZeroCrossingRateFilter implements Filter {
  public getName(): string {
    return get(t)('content.filters.zcr.title');
  }
  public getDescription(): string {
    return get(t)('content.filters.zcr.description');
  }
  public getType(): FilterType {
    return FilterType.ZCR;
  }

  public filter(inValues: number[]): number {
    let count = 0;
    for (let i = 1; i < inValues.length; i++) {
      if (
        (inValues[i] >= 0 && inValues[i - 1] < 0) ||
        (inValues[i] < 0 && inValues[i - 1] >= 0)
      ) {
        count++;
      }
    }
    return count / (inValues.length - 1);
  }

  public getMinNumberOfSamples(): number {
    return 2;
  }
}

export default ZeroCrossingRateFilter;
