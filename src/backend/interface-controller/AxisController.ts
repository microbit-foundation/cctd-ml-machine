/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { MLMachine } from '../interface-adapter/MLMachine';
import type { AbstractReadonlyState } from '../statemanagement/AbstractReadonlyState';
import type { DataService } from '../domain/DataService';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class AxisController {
  setSelectedAxes(axes: Axis[]): void {
    this.dataService.setSelectedAxes(axes);
  }

  toggleAxis(axis: Axis) {
    this.dataService.toggleAxis(axis);
  }

  getAvailableAxes() {
    return this.states.getAvailableAxes();
  }

  setAvailableAxes(axes: Axis[]): void {
    this.dataService.setAvailableAxes(axes);
  }

  private dataService: DataService;

  constructor(
    private mlMachine: MLMachine,
    private states: AbstractStates,
  ) {
    this.dataService = mlMachine.getDataService();
  }

  public getSelectedAxes(): AbstractReadonlyState<Axis[]> {
    return this.states.getSelectedAxes();
  }

  public isAxisIndexSelected(index: number): boolean {
    const axis = this.dataService.getAxisFromIndex(index);
    if (!axis) {
      return false;
    }
    return this.dataService.isAxisSelected(axis);
  }
}
