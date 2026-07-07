/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { KNNModelSettings } from '../../../core/model/KNN/KNNModelSettings';
import { ModelOption } from '../../../core/model/ModelOption';
import { ModelOptions } from '../../../core/model/ModelOptions';
import { SettingsChange } from '../../../core/model/SettingsChange';
import type { GestureService } from '../GestureService';
import type { KNNModelSettingsRepository } from '../KNNModelSettingsRepository';
import type { KNNSettingsService } from '../KNNSettingsService';
import type { ModelTrainingStateRepository } from '../ModelTrainingStateRepository';

export class KNNSettingsServiceImpl implements KNNSettingsService {
  constructor(
    private knnModelSettingsRepository: KNNModelSettingsRepository,
    private gestureService: GestureService,
    private modelTrainingRepository: ModelTrainingStateRepository,
  ) {}

  public setNormalized(checked: any): void {
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    settings.setNormalize(checked);
    this.setKNNModelSettings(
      settings,
      new SettingsChange(
        new ModelOption(ModelOptions.NORMALIZE),
        settings.shouldNormalize(),
        checked,
      ),
    );
  }

  public getKNNModelSettings(): KNNModelSettings {
    return this.knnModelSettingsRepository.getKNNModelSettings();
  }

  public setNumberOfClasses(numberOfClasses: number): void {
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    if (settings.getNumberOfClasses() === numberOfClasses) {
      return;
    }
    settings.setNumberOfClasses(numberOfClasses);
    this.setKNNModelSettings(
      settings,
      new SettingsChange(
        new ModelOption(ModelOptions.NUMBER_OF_CLASSES),
        settings.getNumberOfClasses(),
        numberOfClasses,
      ),
    );
  }

  public setK(k: number): void {
    let safeK = Math.max(k, 1);
    const noOfRecordings = this.gestureService
      .getGestures()
      .reduce((sum, gesture) => sum + gesture.getRecordings().length, 0);
    safeK = Math.min(safeK, noOfRecordings);
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    const oldK = settings.getK();
    settings.setK(safeK);
    this.setKNNModelSettings(
      settings,
      new SettingsChange(new ModelOption(ModelOptions.K), oldK, safeK),
    );
  }

  private setKNNModelSettings<T>(
    knnModelSettings: KNNModelSettings,
    settingsChange: SettingsChange<T>,
  ) {
    const training = this.modelTrainingRepository.getModelTraining();
    training.addPendingSetting(settingsChange);
    this.modelTrainingRepository.saveModelTraining(training);
    this.knnModelSettingsRepository.save(knnModelSettings);
  }
}
