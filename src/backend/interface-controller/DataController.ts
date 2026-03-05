/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { LiveDataStore } from '../../core/LiveDataStore';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { DataService } from '../domain/DataService';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class DataController {
  public constructor(
    private dataService: DataService,
    private states: AbstractStates,
  ) {}

  public addLiveData(input: LiveDataVector): void {
    this.dataService.addLiveData(input);
  }

  public getLiveData(): AbstractState<LiveDataStore<LiveDataVector>> {
    return this.states.getLiveData();
  }

  public isFingerprintEnabled(): AbstractState<boolean> {
    return this.states.getEnableFingerprint();
  }

  public getAvailableAxes(): AbstractState<Axis[] | undefined> {
    return this.states.getAvailableAxes();
  }
}
