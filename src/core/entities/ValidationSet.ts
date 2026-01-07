/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from './Gesture';
import type { RecordingData } from './RecordingData';

export interface ValidationSet {
  gestureId: GestureID;
  recordings: RecordingData[];
}
