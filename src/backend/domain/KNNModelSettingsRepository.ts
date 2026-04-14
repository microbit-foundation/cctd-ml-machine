import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';

export interface KNNModelSettingsRepository {
  getKNNModelSettings(): KNNModelSettings;
  save(settings: KNNModelSettings): void;
}
