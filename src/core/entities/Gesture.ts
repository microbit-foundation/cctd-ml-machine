/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Confidence } from './Confidence';
import type { GestureOutput } from './GestureOutput';
import type { RecordingData } from './RecordingData';

export type GestureID = number;

export interface Gesture {
  getName(): string;
  getID(): GestureID;
  getRecordings(): RecordingData[];
  getOutput(): GestureOutput;
  getColor(): string;
  getConfidence(): Confidence;
}
