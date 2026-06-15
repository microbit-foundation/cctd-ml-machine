import type { KNNModelSettings } from '../../../core/model/KNN/KNNModelSettings';
import type { GestureService } from '../GestureService';
import type { KNNModelSettingsRepository } from '../KNNModelSettingsRepository';
import type { KNNSettingsService } from '../KNNSettingsService';

export class KNNSettingsServiceImpl implements KNNSettingsService {
  constructor(
    private knnModelSettingsRepository: KNNModelSettingsRepository,
    private gestureService: GestureService,
  ) {}
  public setNormalized(checked: any): void {
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    settings.setNormalize(checked);
    this.knnModelSettingsRepository.save(settings);
  }

  public getKNNModelSettings(): KNNModelSettings {
    return this.knnModelSettingsRepository.getKNNModelSettings();
  }

  public setNumberOfClasses(numberOfClasses: number): void {
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    settings.setNumberOfClasses(numberOfClasses);
    this.knnModelSettingsRepository.save(settings);
  }

  public setK(k: number): void {
    let safeK = Math.max(k, 1);
    const noOfRecordings = this.gestureService
      .getGestures()
      .reduce((sum, gesture) => sum + gesture.getRecordings().length, 0);
    safeK = Math.min(safeK, noOfRecordings);
    const settings = this.knnModelSettingsRepository.getKNNModelSettings();
    settings.setK(safeK);
    this.knnModelSettingsRepository.save(settings);
  }
}
