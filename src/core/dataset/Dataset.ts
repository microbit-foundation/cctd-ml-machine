/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureData } from './FeatureData';
import type { Vector } from '../vector/Vector';
import type { DatasetLabels } from './DatasetLabels';
import type { LabelledFeatureSet } from './LabelledFeatureSet';

export interface Dataset extends LabelledFeatureSet {
  getFeatureSet(): FeatureData[];
  getNormalizedFeatureSet(): FeatureData[];
  getLabels(): DatasetLabels;
  isValid(): boolean;
  isEmpty(): boolean;
  getNumberOfClasses(): number;
  getFeatureSize(): number;
  getFeatureMean(): Vector;
  getFeatureStandardDeviation(): Vector;
}
