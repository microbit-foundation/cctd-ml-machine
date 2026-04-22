/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { ModelTraining } from './ModelTraining';
import type { SettingsChange } from './SettingsChange';
import type { TrainingError } from './TrainingError';

export class ModelTrainingImpl implements ModelTraining {
  private training: boolean;

  private error: TrainingError | undefined;
  private pendingSettingsList: SettingsChange<any>[];
  private trainsAutomatically: boolean;

  constructor() {
    this.training = false;
    this.pendingSettingsList = [];
    this.trainsAutomatically = false;
  }

  trainAutomatically(): boolean {
    return this.trainsAutomatically;
  }

  setTrainAutomatically(trainAutomatically: boolean): void {
    this.trainsAutomatically = trainAutomatically;
  }

  getError(): TrainingError | undefined {
    return this.error;
  }

  setError(error: TrainingError): void {
    this.error = error;
  }

  clearError(): void {
    this.error = undefined;
  }

  hasPendingSettings(): boolean {
    return this.pendingSettingsList.length === 0;
  }

  pendingSettings(): SettingsChange<any>[] {
    return this.pendingSettingsList;
  }

  clearPendingSettings(): void {
    this.pendingSettingsList = [];
  }

  addPendingSetting(settingChange: SettingsChange<any>): void {
    this.pendingSettingsList.push(settingChange);
  }

  isTraining(): boolean {
    return this.training;
  }

  setIsTraining(training: boolean): void {
    this.training = training;
  }
}
