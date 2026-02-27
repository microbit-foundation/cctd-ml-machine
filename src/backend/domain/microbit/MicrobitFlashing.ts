/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface MicrobitFlashing {
  isFlashing(): boolean;
  setFlashing(isFlashing: boolean): void;
  getFlashingProgress(): number;
  setFlashingProgress(progress: number): void;
}
