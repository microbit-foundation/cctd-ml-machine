/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureData } from "./FeatureData";
import type { DatasetLabels } from "./DatasetLabels";
import type { LabelledFeatureSet } from "./LabelledFeatureSet";

export class LabelledFeatureSetImpl implements LabelledFeatureSet {

  public constructor(private featureSet: FeatureData[], private labels: DatasetLabels) { }

  getFeatureSet(): FeatureData[] {
    return this.featureSet;
  }
  getLabels(): DatasetLabels {
    return this.labels;
  }
}
