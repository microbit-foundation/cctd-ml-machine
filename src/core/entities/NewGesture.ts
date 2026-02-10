/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Confidence } from './Confidence';
import type { GestureOutput } from './GestureOutput';
import type { Recording } from './recording/Recording';
import type { RecordingData } from './RecordingData';

export type GestureID = number;

export interface NewGesture {
  setOutput(ouput: GestureOutput): void;
  setRecordings(recordings: RecordingData[]): void;
  setName(name: string): void;
  getName(): string;
  getID(): GestureID;
  getRecordings(): Recording[];
  getValidationRecordings(): Recording[];
  getOutput(): GestureOutput;
  getColor(): string;
  getConfidence(): Confidence;
}
