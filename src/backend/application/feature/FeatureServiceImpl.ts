/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureValue } from './FeatureValue';
import type { FeatureProvider } from './FeatureProvider';
import type { Feature } from './Feature';
import type { FeatureService } from './FeatureService';

export class FeatureServiceImpl implements FeatureService {
  public constructor(private featureProvider: FeatureProvider) {}

  public isFeatureSet(feature: Feature): boolean {
    return this.featureProvider.getFeature(feature).isSet();
  }

  public getFeature<T>(feature: Feature): FeatureValue<T> {
    return this.featureProvider.getFeature(feature);
  }
}
