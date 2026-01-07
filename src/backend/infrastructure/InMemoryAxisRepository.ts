/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { Gesture } from '../../core/entities/Gesture';
import type { AxisRepository } from '../domain/AxisRepository';
import type { GestureService } from '../domain/GestureService';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { Logger } from '../../core/logging/Logger';
import type { NewGesture } from '../../core/entities/NewGesture';

export class InMemoryAxisRepository implements AxisRepository {
  private log: Logger;
  private selectedAxes: Axis[] | undefined;
  private availableAxes: Axis[] | undefined;

  constructor(private gestureService: GestureService) {
    this.selectedAxes = undefined;
    this.log = new ConsoleLogger('InMemoryAxisRepository');
  }

  setSelectedAxes(axes: Axis[]): void {
    this.selectedAxes = axes;
  }

  public getAvailableAxes(): Axis[] {
    if (!this.availableAxes) {
      this.availableAxes = this.getAvailableAxesFromRecordings();
    }
    return this.availableAxes;
  }

  public getSelectedAxes(): Axis[] {
    if (!this.selectedAxes) {
      this.selectedAxes = this.getAvailableAxesFromRecordings();
    }
    return this.selectedAxes;
  }

  private getAvailableAxesFromRecordings(): Axis[] {
    const gestures: NewGesture[] = this.gestureService.getGestures();
    if (gestures.length > 0) {
      const recordings = gestures[0].getRecordings();
      if (recordings.length > 0) {
        this.log.log('Found default available axes in recordings', recordings[0].labels);
        return recordings[0].labels.map(
          (label: string, index: number) =>
            ({
              index,
              label,
            }) as Axis,
        );
      }
    }
    return [];
  }
}
