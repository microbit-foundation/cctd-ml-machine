import type { LabelledPoint } from '../../../core/model/KNN/LabelledPoint';
import type { DataService } from '../DataService';
import type { KNNModelService } from '../KNNModelService';
import type { KNNSettingsService } from '../KNNSettingsService';

export class KNNModelServiceImpl implements KNNModelService {
  constructor(
    private dataService: DataService,
    private knnSettingsService: KNNSettingsService,
  ) {}

  getPoints(): LabelledPoint[] {
    const settings = this.knnSettingsService.getKNNModelSettings();
    const labels = this.dataService
      .getTrainingDataset(settings.shouldNormalize())
      .getLabels();
    const features = this.dataService
      .getTrainingDataset(settings.shouldNormalize())
      .getFeatureSet();
    const points: LabelledPoint[] = [];
    for (let i = 0; i < features.length; i++) {
      points.push({
        vector: features[i].getFeatures(),
        classIndex: labels.getIndexLabels()[i].getIndex(),
      });
    }
    return points;
  }
}
