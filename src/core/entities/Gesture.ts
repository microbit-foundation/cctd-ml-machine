/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Confidence } from './Confidence';
import type { GestureOutput } from './GestureOutput';
import type { RecordingData } from './RecordingData';

export type GestureID = number;

export interface Gesture {
  name: string;
  ID: GestureID;
  recordings: RecordingData[];
  output: GestureOutput;
  color: string;
  confidence: Confidence;
}
