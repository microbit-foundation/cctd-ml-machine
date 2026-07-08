/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Filter } from '../../../core/filter/Filter';

export interface FilterListListener {
  onFiltersChanged(filters: Filter[]): void;
}
