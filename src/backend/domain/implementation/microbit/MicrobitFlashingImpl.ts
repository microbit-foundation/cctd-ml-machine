/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitFlashing } from '../../microbit/MicrobitFlashing';

export class MicrobitFlashingImpl implements MicrobitFlashing {
  private progress: number = 0;
  private flashing: boolean = false;

  constructor(initialProgress = 0) {
    this.setFlashingProgress(initialProgress);
  }
  isFlashing(): boolean {
    return this.flashing;
  }
  setFlashing(isFlashing: boolean): void {
    this.flashing = isFlashing;
  }

  getFlashingProgress(): number {
    return this.progress;
  }

  setFlashingProgress(progress: number): void {
    const normalized = Math.max(0, Math.min(1, progress));
    this.progress = normalized;
  }
}

export default MicrobitFlashingImpl;
