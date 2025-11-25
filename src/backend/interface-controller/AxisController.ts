/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import type { Axis } from '../../core/entities/Axis';
import type { AbstractState } from '../interface-adapter/AbstractState';
import type { MLMachine } from '../interface-adapter/MLMachine';
import { SvelteStateAdapter } from '../interface-adapter/SvelteStateAdapter';
import type { AbstractReadonlyState } from '../interface-adapter/AbstractReadonlyState';
import type { DataService } from '../domain/DataService';

export class AxisController {
  setSelectedAxes(axes: Axis[]): void {
    this.dataService.setSelectedAxes(axes);
    this.updateSelectedAxesState();
  }

  toggleAxis(axis: Axis) {
    this.dataService.toggleAxis(axis);
    this.updateSelectedAxesState();
  }

  getAvailableAxes() {
    return this.availableAxesState;
  }

  private selectedAxesState: AbstractState<Axis[]>;
  private availableAxesState: AbstractState<Axis[]>;
  private dataService: DataService;

  constructor(private mlMachine: MLMachine) {
    this.selectedAxesState = new SvelteStateAdapter(
      writable(mlMachine.getDataService().getSelectedAxes()),
    );
    this.availableAxesState = new SvelteStateAdapter(
      writable(mlMachine.getDataService().getAvailableAxes()),
    );
    this.dataService = mlMachine.getDataService();
  }

  public getSelectedAxes(): AbstractReadonlyState<Axis[]> {
    return this.selectedAxesState;
  }

  public isAxisIndexSelected(index: number): boolean {
    const axis = this.dataService.getAxisFromIndex(index);
    if (!axis) {
      return false;
    }
    return this.dataService.isAxisSelected(axis);
  }

  private updateSelectedAxesState() {
    this.selectedAxesState.set(this.dataService.getSelectedAxes());
  }
}
