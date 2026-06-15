import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';

export interface KNNSettingsService {
  setNormalized(checked: any): void;
  setNumberOfClasses(numberOfClasses: number): void;
  getKNNModelSettings(): KNNModelSettings;
  setK(k: number): void;
}
