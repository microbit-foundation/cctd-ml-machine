/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Feature } from '../application/feature/Feature';
import type { FeatureService } from '../application/feature/FeatureService';

export class FeatureController {
  public constructor(private featureService: FeatureService) {}

  public hasFeature(feature: Feature): boolean {
    return this.featureService.getFeature<boolean>(feature).isSet();
  }
}
