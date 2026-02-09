/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureData } from './FeatureData';
import type { Vector } from '../vector/Vector';
import type { Dataset } from './Dataset';
import type { DatasetLabels } from './DatasetLabels';

export default class DatasetImpl implements Dataset {
  constructor(
    private readonly featureSet: FeatureData[],
    private readonly labels: DatasetLabels,
    private readonly numberOfClasses: number,
    private readonly featureSize: number,
    private readonly featureMean: Vector,
    private readonly featureStdDev: Vector,
  ) {}

  public getFeatureSet(): FeatureData[] {
    return this.featureSet;
  }

  public getNormalizedFeatureSet(): FeatureData[] {
    const self = this;
    return this.featureSet.map(fd => {
      const raw = fd.getFeatures();
      return {
        getFeatures(): Vector {
          return self.normalizePoint(raw, self.featureMean, self.featureStdDev);
        },
      } as FeatureData;
    });
  }

  public getLabels(): DatasetLabels {
    return this.labels;
  }

  public isValid(): boolean {
    return this.valid;
  }

  public getNumberOfClasses(): number {
    return this.numberOfClasses;
  }

  public getFeatureSize(): number {
    return this.featureSize;
  }

  public getFeatureMean(): Vector {
    return this.featureMean;
  }

  public getFeatureStandardDeviation(): Vector {
    return this.featureStdDev;
  }

  private normalizePoint(point: Vector, mean: Vector, stdDeviation: Vector) {
    return point.subtract(mean).divide(stdDeviation);
  }
}
