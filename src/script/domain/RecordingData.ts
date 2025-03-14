/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface RecordingSample {
  vector: number[];
}

export interface RecordingData {
  ID: number;
  samples: RecordingSample[];
  labels: string[];
}
