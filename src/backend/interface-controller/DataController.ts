/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { Recording } from '../../core/entities/recording/Recording';
import type { Filter, FilterType } from '../../core/filter/Filter';
import type { LiveDataStore } from '../../core/LiveDataStore';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { Vector } from '../../core/vector/Vector';
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

  public setLiveDataStore(data: LiveDataStore<LiveDataVector>): void {
    this.dataService.setLiveDataStore(data);
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

  public getSelectedAxes(): AbstractState<Axis[] | undefined> {
    return this.states.getSelectedAxes();
  }

  public setSelectedAxes(axes: Axis[]): void {
    this.dataService.setSelectedAxes(axes);
  }

  public toggleAxis(axis: Axis): void {
    this.dataService.toggleAxis(axis);
  }

  public hasSufficientDataForTraining(): boolean {
    return this.dataService.hasSufficientDataForTraining();
  }

  public graphNormalize(data: Vector): Vector {
    return this.dataService.graphNormalize(data);
  }

  public extractSelectedAxesFromRecording(recording: Recording): Recording {
    return this.dataService.extractSelectedAxesFromRecording(recording);
  }

  public applyFilters(data: Vector[]): Vector {
    return this.dataService.applyFilters(data);
  }
}
