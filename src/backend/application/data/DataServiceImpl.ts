/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../../core/entities/Axis';
import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
import type { AxisRepository } from '../../domain/AxisRepository';
import type { DataService } from '../../domain/DataService';
import type { LiveDataRepository } from '../../domain/LiveDataRepository';
import type { NotifierService } from '../../domain/NotifierService';

export class DataServiceImpl implements DataService {
  constructor(
    private axisRepository: AxisRepository,
    private liveDataRepository: LiveDataRepository,
    private notifierService: NotifierService,
  ) {}

  addLiveData(input: LiveDataVector): void {
    this.liveDataRepository.addInput(input);
  }

  setSelectedAxes(axes: Axis[]): void {
    this.axisRepository.setSelectedAxes(axes);
  }

  toggleAxis(axis: Axis): void {
    const isSelected = this.isAxisSelected(axis);
    if (isSelected) {
      // TODO: Maybe this should be axisRepository.removeSelectedAxis(...)
      this.setSelectedAxes(
        [...this.getSelectedAxes()].filter(ax => ax.index !== axis.index),
      );
    } else {
      this.setSelectedAxes([...this.getSelectedAxes(), axis]);
    }
  }

  getAvailableAxes(): Axis[] {
    return this.axisRepository.getAvailableAxes();
  }

  public getAxisFromIndex(index: number): Axis | undefined {
    return this.axisRepository.getAvailableAxes().find(ax => ax.index === index);
  }

  public isAxisSelected(axis: Axis): boolean {
    return !!this.axisRepository.getSelectedAxes().find(ax => ax.index === axis.index);
  }

  public getSelectedAxes(): Axis[] {
    return this.axisRepository.getSelectedAxes();
  }
}
