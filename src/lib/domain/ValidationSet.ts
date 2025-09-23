/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from '../../core/entities/Gesture';
import type { RecordingData } from '../../core/entities/RecordingData';

export interface ValidationSet {
  gestureId: GestureID;
  recordings: RecordingData[];
}
