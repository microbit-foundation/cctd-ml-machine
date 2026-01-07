/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Dataset } from '../../dataset/Dataset';
import KNNMLModel from './KNNMLModel';
import type { KNNModelSettings } from './KNNModelSettings';
import type { ModelInfo } from '../ModelRegistry';
import ModelRegistry from '../ModelRegistry';
import type { ModelTrainer, ModelTrainerResult } from '../ModelTrainer';
import type { FeatureData } from '../../classifier/FeatureData';
import { KNNMLModelTrainingResult } from './KNNMLModelTrainingResult';
import type { LabelledPoint } from './LabelledPoint';

/**
 * Trains a K-Nearest Neighbour model
 */
class KNNModelTrainer implements ModelTrainer<KNNMLModel, KNNMLModelTrainingResult> {
  constructor(private settings: KNNModelSettings) {}

  public getModelInfo(): ModelInfo {
    return ModelRegistry.KNN;
  }

  public trainModel(
    dataset: Dataset,
  ): Promise<ModelTrainerResult<KNNMLModel, KNNMLModelTrainingResult>> {
    const featureSet = this.getFeatureSet(dataset);
    const labels = dataset.getLabels().getIndexLabels();

    const labelledPoints: LabelledPoint[] = featureSet.map((featureData, idx) => ({
      classIndex: labels[idx].getIndex(),
      vector: featureData.getFeatures(),
    }));

    return Promise.resolve({
      model: new KNNMLModel(
        this.settings,
        labelledPoints,
        dataset.getFeatureMean(),
        dataset.getFeatureStandardDeviation(),
      ),
      trainingInformation: new KNNMLModelTrainingResult(labelledPoints),
    });
  }

  private getFeatureSet(dataset: Dataset): FeatureData[] {
    if (this.settings.normalize) {
      return dataset.getNormalizedFeatureSet();
    }
    return dataset.getFeatureSet();
  }
}

export default KNNModelTrainer;
