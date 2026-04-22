/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { SettingsChange } from "./SettingsChange";
import type { TrainingError } from "./TrainingError";

export interface ModelTraining {
  isTraining(): boolean;
  setIsTraining(training: boolean): void;
  trainAutomatically(): boolean;
  setTrainAutomatically(trainAutomatically: boolean): void;
  getError(): TrainingError | undefined;
  setError(error: TrainingError): void;
  clearError(): void;
  hasPendingSettings(): boolean;
  pendingSettings(): SettingsChange<any>[];
  clearPendingSettings(): void;
  addPendingSetting(settingChange: SettingsChange<any>): void;
}
