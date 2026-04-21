import type { RecordingSettings } from "./recording/RecordingSettings";

export interface RecordingSettingsRepository {
    getRecordingSettings(): RecordingSettings;
    saveRecordingSettings(settings: RecordingSettings): void;
}