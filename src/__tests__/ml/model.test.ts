/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import BaseVector from '../../core/vector/BaseVector';
import { NeuralNetworkModelTrainer } from '../../core/model/neural-network/NeuralNetworkModelTrainer';
import KNNModelTrainer from '../../core/model/KNN/KNNModelTrainer';
import { KNNModelSettingsImpl } from '../../core/model/KNN/KNNModelSettingsImpl';
import type { KNNModelObserver } from '../../core/model/KNN/KNNModelObserver';
import type { Dataset } from '../../core/dataset/Dataset';
import type { DatasetLabels } from '../../core/dataset/DatasetLabels';
import type { FeatureData } from '../../core/dataset/FeatureData';
import type { Vector } from '../../core/vector/Vector';
import { DataIndexLabel } from '../../core/dataset/DataIndexLabel';
import { BasicNeuralNetworkArchitecture } from '../../core/model/neural-network/BasicNeuralNetworkArchitecture';

class SimpleDatasetLabels implements DatasetLabels {
  constructor(private labels: BaseVector[]) {}

  getLabelVectors(): Vector[] {
    return this.labels;
  }

  getIndexLabels(): DataIndexLabel[] {
    return this.labels.map(label => new DataIndexLabel(label));
  }
}

class SimpleFeatureData implements FeatureData {
  constructor(private values: number[]) {}

  getFeatures(): Vector {
    return new BaseVector(this.values);
  }
}

class SimpleDataset implements Dataset {
  constructor(
    private featureSet: FeatureData[],
    private labels: DatasetLabels,
    private featureMean: Vector,
    private featureStd: Vector,
  ) {}

  isEmpty(): boolean {
    return this.featureSet.length === 0;
  }

  getFeatureSet(): FeatureData[] {
    return this.featureSet;
  }

  getNormalizedFeatureSet(): FeatureData[] {
    return this.featureSet;
  }

  getLabels(): DatasetLabels {
    return this.labels;
  }

  isValid(): boolean {
    return true;
  }

  getNumberOfClasses(): number {
    return this.labels.getLabelVectors()[0]?.getSize() ?? 0;
  }

  getFeatureSize(): number {
    return this.featureSet[0]?.getFeatures().getSize() ?? 0;
  }

  getFeatureMean(): Vector {
    return this.featureMean;
  }

  getFeatureStandardDeviation(): Vector {
    return this.featureStd;
  }
}

describe('ML Model tests', () => {
  describe('Layers Model', () => {
    test('throws when dataset is invalid', async () => {
      const invalidDataset = {
        isValid: () => false,
      } as Dataset;

      const trainer = new NeuralNetworkModelTrainer({
        shouldNormalize: () => false,
        setTrainingObserver: () => {},
        getArchitecture: () => new BasicNeuralNetworkArchitecture(2, 2, 2),
        getLearningSettings: () => ({
          getLearningRate: () => 0.1,
          setLearningRate: () => {},
          getNumberOfEpochs: () => 1,
          setNumberOfEpochs: () => {},
          getBatchSize: () => 1,
          setBatchSize: () => {},
          getValidationSplit: () => 0,
          setValidationSplit: () => {},
        }),
        getTrainingObserver: () => ({
          handleTrainingIteration: () => {},
        }),
      });

      await expect(trainer.trainModel(invalidDataset)).rejects.toThrow(
        'Dataset chosen to train with is invalid!',
      );
    });
  });

  describe('KNN-non normalized Model', () => {
    test('predicts nearest class when trained', async () => {
      const dataset = new SimpleDataset(
        [new SimpleFeatureData([0, 0]), new SimpleFeatureData([10, 10])],
        new SimpleDatasetLabels([new BaseVector([1, 0]), new BaseVector([0, 1])]),
        new BaseVector([0, 0]),
        new BaseVector([1, 1]),
      );
      const observer: KNNModelObserver = {
        onInputComputed: () => {},
        onNearestNeighboursFound: () => {},
      };

      const trainingResult = await new KNNModelTrainer(
        new KNNModelSettingsImpl(1, 2, false),
        observer,
      ).trainModel(dataset);

      const prediction = await trainingResult.model.predict(new BaseVector([1, 1]));
      expect(prediction.getValue()).toStrictEqual([1, 0]);
    });
  });
});
