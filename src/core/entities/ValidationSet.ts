/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from './Gesture';
import type { RecordingData } from './RecordingData';

export interface ValidationSet {
  gestureId: GestureID;
  recordings: RecordingData[];
}
