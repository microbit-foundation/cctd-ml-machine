/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { LiveData } from '../../lib/domain/stores/LiveData';
import type { DataService } from '../domain/DataService';
import type { AbstractReadonlyState } from '../interface-adapter/AbstractReadonlyState';

export class DataController {
  public constructor(
    private dataService: DataService,
    private liveData: AbstractReadonlyState<LiveData<LiveDataVector>>,
  ) {}

  public addLiveData(input: LiveDataVector): void {
    this.dataService.addLiveData(input);
  }

  public getLiveData() {
    return this.liveData;
  }
}
