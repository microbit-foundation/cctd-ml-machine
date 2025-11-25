/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import StaticConfiguration from '../../StaticConfiguration';
import type { GestureRepository } from '../domain/GestureRepository';
import type { SystemColors } from '../domain/implementation/SystemColors';

export class MLMachineColors implements SystemColors {
  constructor(private gestureRepository: GestureRepository) {}

  generateGestureColor(): string {
    const color =
      StaticConfiguration.gestureColors[
        this.getNumberOfGestures() % StaticConfiguration.gestureColors.length
      ];

    return color;
  }

  getNumberOfGestures(): number {
    return this.gestureRepository.getGestures().length;
  }
}
