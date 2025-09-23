/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { RecordingData } from './RecordingData';
import type { GestureID } from './stores/gesture/GestureState';

export interface ValidationSet {
  gestureId: GestureID;
  recordings: RecordingData[];
}
