/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { RecordingSettings } from './recording/RecordingSettings';

export interface RecordingSettingsRepository {
  getRecordingSettings(): RecordingSettings;
  saveRecordingSettings(settings: RecordingSettings): void;
}
