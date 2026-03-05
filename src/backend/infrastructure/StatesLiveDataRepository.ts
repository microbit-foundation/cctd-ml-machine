/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { InMemoryLiveDataStore } from '../../core/InMemoryLiveDataStore';
import type { TimestampedData } from '../../core/LiveDataBuffer';
import type { LiveDataStore } from '../../core/LiveDataStore';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { LiveData } from '../../lib/domain/stores/LiveData';
import type { LiveDataRepository } from '../domain/LiveDataRepository';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class InMemoryLiveDataRepository implements LiveDataRepository {
  constructor(private states: AbstractStates) {}

  getSeries(time: number, noOfElements: number): TimestampedData<LiveDataVector>[] {
    return this.states.getLiveData().get().getBuffer().getSeries(time, noOfElements);
  }

  addInput(data: LiveDataVector): void {
    this.states.getLiveData().get().put(data);
  }
}
