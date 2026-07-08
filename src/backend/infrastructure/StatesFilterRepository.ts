/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Filter } from '../../core/filter/Filter';
import type { FilterListListener } from '../domain/eventlistener/FilterListListener';
import type { FilterRepository } from '../domain/FilterRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesFilterRepository implements FilterRepository {
  private listeners: FilterListListener[];

  public constructor(
    private states: AbstractStates,
    initialListeners: FilterListListener[] = [],
  ) {
    this.listeners = [...initialListeners];
  }

  saveFilters(filters: Filter[]): void {
    this.states.getFilters().set(filters);
    this.publish(filters);
  }

  getFilters(): Filter[] {
    return this.states.getFilters().get();
  }

  private publish(filters: Filter[]): void {
    for (const listener of this.listeners) {
      listener.onFiltersChanged(filters);
    }
  }
}
