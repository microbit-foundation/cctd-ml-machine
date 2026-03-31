/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureData } from './FeatureData';
import type { Vector } from '../vector/Vector';
import type { Dataset } from './Dataset';
import type { DatasetLabels } from './DatasetLabels';
import type { LabelledFeatureSet } from './LabelledFeatureSet';

export default class DatasetImpl implements Dataset {
  private numberOfClasses: number;

  constructor(
    private readonly featureSet: LabelledFeatureSet,
    private readonly featureSize: number,
    private readonly featureMean: Vector,
    private readonly featureStdDev: Vector,
  ) {
    this.numberOfClasses = featureSet.getLabels().getIndexLabels().length;
  }

  public isEmpty(): boolean {
    return this.featureSet.getFeatureSet().length === 0;
  }

  public getFeatureSet(): FeatureData[] {
    return this.featureSet.getFeatureSet();
  }

  public getNormalizedFeatureSet(): FeatureData[] {
    const self = this;
    return this.featureSet.getFeatureSet().map(fd => {
      const raw = fd.getFeatures();
      return {
        getFeatures(): Vector {
          return self.normalizePoint(raw, self.featureMean, self.featureStdDev);
        },
      } as FeatureData;
    });
  }

  public getLabels(): DatasetLabels {
    return this.featureSet.getLabels();
  }

  public isValid(): boolean {
    return true;
  }

  public getNumberOfClasses(): number {
    return this.numberOfClasses;
  }

  /**
   * The size of input features. I.e the number of filters times the number of axes
   */
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
