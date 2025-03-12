/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { RecordingData } from './RecordingData';
import type { GestureID } from './stores/gesture/Gesture';

export interface ValidationSet {
  gestureId: GestureID;
  recordings: RecordingData[];
}
