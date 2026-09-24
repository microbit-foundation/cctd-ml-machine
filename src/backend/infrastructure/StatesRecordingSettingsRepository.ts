/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { RecordingSettings } from '../domain/recording/RecordingSettings';
import type { RecordingSettingsRepository } from '../domain/RecordingSettingsRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesRecordingSettingsRepository implements RecordingSettingsRepository {
  constructor(private states: AbstractStates) {}

  getRecordingSettings(): RecordingSettings {
    return this.states.getRecordingSettings().get();
  }
  saveRecordingSettings(settings: RecordingSettings): void {
    this.states.getRecordingSettings().set(settings);
  }
}
