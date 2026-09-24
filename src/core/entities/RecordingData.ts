/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * @deprecated Legacy interface. Use Sample.ts instead. Use SerializedSample.ts for serialization and deserialization of samples.
 */
export interface RecordingSample {
  vector: number[];
}

/**
 * @deprecated This is a legacy interface that should not be used. It is used for serialization and deserialization of recordings, and should not be used in the rest of the codebase.
 *   For serialization use SerializedRecording. For other usecases use the Recording interface.
 */
export interface RecordingData {
  ID: number;
  samples: RecordingSample[];
  labels: string[];
}
