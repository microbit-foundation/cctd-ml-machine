/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { LiveDataStore } from '../../core/LiveDataStore';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { DataService } from '../domain/DataService';
import type { AbstractReadonlyState } from '../statemanagement/AbstractReadonlyState';

export class DataController {
  public constructor(
    private dataService: DataService,
    private liveData: AbstractReadonlyState<LiveDataStore<LiveDataVector>>,
  ) {}

  public addLiveData(input: LiveDataVector): void {
    this.dataService.addLiveData(input);
  }

  public getLiveData() {
    return this.liveData;
  }
}
