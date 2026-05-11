/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { AxisRepository } from '../domain/AxisRepository';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { Logger } from '../../core/logging/Logger';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { AbstractStates } from '../statemanagement/AbstractStates';
import type { GestureRepository } from '../domain/GestureRepository';

export class StatesAxisRepository implements AxisRepository {
  private log: Logger;

  constructor(
    private gestureRepository: GestureRepository,
    private states: AbstractStates,
  ) {
    this.log = new ConsoleLogger(StatesAxisRepository.name);

    if (!states.getAvailableAxes().get().length) {
      const availableAxes = this.getAvailableAxesFromRecordings();
      this.log.log('Setting available axes in state from recordings', availableAxes);
      states.getAvailableAxes().set(availableAxes);
    }
    if (!states.getSelectedAxes().get().length) {
      const selectedAxes = this.getAvailableAxesFromRecordings();
      this.log.log('Setting selected axes in state from recordings', selectedAxes);
      states.getSelectedAxes().set(selectedAxes);
    }
  }

  setAvailableAxes(axes: Axis[]): void {
    this.states.getAvailableAxes().set(axes);
  }

  setSelectedAxes(axes: Axis[]): void {
    this.states.getSelectedAxes().set(axes);
  }

  public getAvailableAxes(): Axis[] {
    return this.states.getAvailableAxes().get() || [];
  }

  public getSelectedAxes(): Axis[] {
    return this.states.getSelectedAxes().get() || [];
  }

  private getAvailableAxesFromRecordings(): Axis[] {
    const gestures: NewGesture[] = this.gestureRepository.getGestures();
    if (gestures.length > 0) {
      const recordings = gestures[0].getRecordings();
      if (recordings.length > 0) {
        this.log.log(
          'Found default available axes in recordings',
          recordings[0].getAxes(),
        );
        return recordings[0].getAxes();
      }
    }
    return [];
  }
}
