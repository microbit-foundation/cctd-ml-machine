import type { Filter } from '../../../core/filter/Filter';

export interface FilterListListener {
  onFiltersChanged(filters: Filter[]): void;
}