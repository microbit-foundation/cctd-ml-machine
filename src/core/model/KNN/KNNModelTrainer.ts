/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { knnTrainingDataPoints } from '../../../lib/stores/KNNStores';
import type { Dataset } from '../../dataset/Dataset';
import KNNMLModel from './KNNMLModel';
import type { KNNModelSettings } from './KNNModelSettings';
import type { LabelledPoint } from '../KNNNonNormalizedMLModel';
import type { ModelInfo } from '../ModelRegistry';
import ModelRegistry from '../ModelRegistry';
import type { ModelTrainer } from '../ModelTrainer';

/**
 * Trains a K-Nearest Neighbour model
 */
class KNNModelTrainer implements ModelTrainer<KNNMLModel> {
  constructor(private settings: KNNModelSettings) {}

  public getModelInfo(): ModelInfo {
    return ModelRegistry.KNN;
  }

  public trainModel(dataset: Dataset): Promise<KNNMLModel> {
    if (this.settings.normalize) {
      asdf do stuff here hehe1
    }
    const featureSet = dataset.getFeatureSet();
    const labels = dataset.getLabels().getIndexLabels();

    const labelledPoints: LabelledPoint[] = featureSet.map((featureData, idx) => ({
      classIndex: labels[idx].getIndex(),
      vector: featureData.getFeatures()
    }));

    knnTrainingDataPoints.set(labelledPoints);

    return Promise.resolve(
      new KNNMLModel(this.settings, labelledPoints, dataset.getFeatureMean(), dataset.getFeatureStandardDeviation()),
    );
  }
}

export default KNNModelTrainer;
