/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { describe, test, expect } from 'vitest';
import type { DatasetLabels } from '../../core/dataset/DatasetLabels';
import BaseVector from '../../core/vector/BaseVector';
import type { Dataset } from '../../core/dataset/Dataset';
import type { FeatureData } from '../../core/dataset/FeatureData';
import type { Vector } from '../../core/vector/Vector';
import { VectorPredictionOutput } from '../../core/classifier/vector-classifier/VectorPredictionOutput';
import { AccuracyClassifierEvaluator } from '../../core/classifier/evaluator/AccuracyClassifierEvaluator';
import type { DataIndexLabel } from '../../core/dataset/DataIndexLabel';

class SimpleDatasetLabels implements DatasetLabels {
  private labelVectors: BaseVector[];
  constructor(labelVectors: number[][]) {
    this.labelVectors = labelVectors.map(v => new BaseVector(v));
  }
  getIndexLabels(): DataIndexLabel[] {
    throw new Error('Method not implemented.');
  }
  public getLabelVectors(): BaseVector[] {
    return this.labelVectors;
  }
}

class SimpleDataset implements Dataset {
  private featureSet: FeatureData[];
  private labels: DatasetLabels;
  constructor(features: FeatureData[], labelVectors: number[][]) {
    this.featureSet = features;
    this.labels = new SimpleDatasetLabels(labelVectors);
  }
  isEmpty(): boolean {
    throw new Error('Method not implemented.');
  }
  getNormalizedFeatureSet(): FeatureData[] {
    throw new Error('Method not implemented.');
  }
  isValid(): boolean {
    throw new Error('Method not implemented.');
  }
  getNumberOfClasses(): number {
    throw new Error('Method not implemented.');
  }
  getFeatureSize(): number {
    throw new Error('Method not implemented.');
  }
  getFeatureMean(): Vector {
    throw new Error('Method not implemented.');
  }
  getFeatureStandardDeviation(): Vector {
    throw new Error('Method not implemented.');
  }
  public getFeatureSet(): FeatureData[] {
    return this.featureSet;
  }
  public getLabels(): DatasetLabels {
    return this.labels;
  }
}

class SimpleFeatureData implements FeatureData {
  private features: number[];
  constructor(features: number[]) {
    this.features = features;
  }
  public getFeatures(): Vector {
    return new BaseVector(this.features);
  }
}

describe('AccuracyClassifierEvaluator', () => {
  test('calculates perfect accuracy', () => {
    const features = [new SimpleFeatureData([0]), new SimpleFeatureData([1])];
    const labels = [
      [1, 0],
      [0, 1],
    ]; // two classes, first sample class 0, second sample class 1
    const dataset = new SimpleDataset(features, labels);

    const predictions = [
      new VectorPredictionOutput(new BaseVector([1, 0])),
      new VectorPredictionOutput(new BaseVector([0, 1])),
    ];

    const evaluator = new AccuracyClassifierEvaluator();
    const result = evaluator.getEvaluation(dataset, predictions);

    expect(result.getAccuracy()).toBeCloseTo(1);
  });

  test('calculates zero accuracy', () => {
    const features = [new SimpleFeatureData([0]), new SimpleFeatureData([1])];
    const labels = [
      [1, 0],
      [0, 1],
    ];
    const dataset = new SimpleDataset(features, labels);

    const predictions = [
      new VectorPredictionOutput(new BaseVector([0, 1])),
      new VectorPredictionOutput(new BaseVector([1, 0])),
    ];

    const evaluator = new AccuracyClassifierEvaluator();
    const result = evaluator.getEvaluation(dataset, predictions);

    expect(result.getAccuracy()).toBeCloseTo(0);
  });

  test('calculates half accuracy', () => {
    const features = [new SimpleFeatureData([0]), new SimpleFeatureData([1])];
    const labels = [
      [1, 0],
      [0, 1],
    ];
    const dataset = new SimpleDataset(features, labels);

    // First prediction correct, second prediction incorrect -> accuracy = 0.5
    const predictions = [
      new VectorPredictionOutput(new BaseVector([1, 0])),
      new VectorPredictionOutput(new BaseVector([1, 0])),
    ];

    const evaluator = new AccuracyClassifierEvaluator();
    const result = evaluator.getEvaluation(dataset, predictions);

    expect(result.getAccuracy()).toBeCloseTo(0.5);
  });

  test('throws on size mismatch', () => {
    const features = [new SimpleFeatureData([0])];
    const labels = [[1, 0]];
    const dataset = new SimpleDataset(features, labels);

    const predictions = [
      new VectorPredictionOutput(new BaseVector([1, 0])),
      new VectorPredictionOutput(new BaseVector([0, 1])),
    ];

    const evaluator = new AccuracyClassifierEvaluator();
    expect(() => evaluator.getEvaluation(dataset, predictions)).toThrow();
  });
});
