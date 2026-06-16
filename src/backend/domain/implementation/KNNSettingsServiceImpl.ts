import type { KNNModelSettings } from '../../../core/model/KNN/KNNModelSettings';
import { ModelOption } from '../../../core/model/ModelOption';
import { SettingsChange } from '../../../core/model/SettingsChange';
import type { GestureService } from '../GestureService';
import type { KNNModelSettingsRepository } from '../KNNModelSettingsRepository';
import type { KNNSettingsService } from '../KNNSettingsService';
import type { ModelTrainingStateRepository } from '../ModelTrainingStateRepository';

export class KNNSettingsServiceImpl implements KNNSettingsService {
  constructor(
    private knnModelSettingsRepository: KNNModelSettingsRepository,
    private gestureService: GestureService,
    private modelTrainingRepository: ModelTrainingStateRepository
  ) {}

  public setNormalized(checked: any): void {
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    settings.setNormalize(checked);
    this.setKNNModelSettings(settings, new SettingsChange(new ModelOption("Normalize"), settings.shouldNormalize(), checked));
  }

  public getKNNModelSettings(): KNNModelSettings {
    return this.knnModelSettingsRepository.getKNNModelSettings();
  }

  public setNumberOfClasses(numberOfClasses: number): void {
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    settings.setNumberOfClasses(numberOfClasses);
    this.setKNNModelSettings(settings, new SettingsChange(new ModelOption("Number of Classes"), settings.getNumberOfClasses(), numberOfClasses));
  }

  public setK(k: number): void {
    let safeK = Math.max(k, 1);
    const noOfRecordings = this.gestureService
      .getGestures()
      .reduce((sum, gesture) => sum + gesture.getRecordings().length, 0);
    safeK = Math.min(safeK, noOfRecordings);
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    this.setKNNModelSettings(settings, new SettingsChange(new ModelOption("K"), settings.getK(), safeK));
  }

  private setKNNModelSettings<T>(knnModelSettings: KNNModelSettings, settingsChange: SettingsChange<T>) {
    const training = this.modelTrainingRepository.getModelTraining();
    training.addPendingSetting(settingsChange);
    this.modelTrainingRepository.saveModelTraining(training);
    this.knnModelSettingsRepository.save(knnModelSettings);
  }
}
