/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Recording } from '../../core/entities/recording/Recording';

export interface RecordingService {
  recordDataExample(gesture: NewGesture): Promise<Recording>;
  recordValidationExample(gesture: NewGesture): Promise<Recording>;
  isRecording(): boolean;
  recordingGesture(): NewGesture | undefined;
}
