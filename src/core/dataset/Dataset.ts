/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureData } from '../classifier/FeatureData';
import type { DatasetLabels } from './DatasetLabels';

export interface Dataset {
  getFeatureSet(): FeatureData[];
  getLabels(): DatasetLabels;
  isValid(): boolean;
  getNumberOfClasses(): number;
  getFeatureSize(): number;
}
