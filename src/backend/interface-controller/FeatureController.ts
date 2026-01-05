/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Feature } from '../../lib/FeatureToggles';
import type { FeatureService } from '../application/feature/FeatureService';

export class FeatureController {
  public constructor(featureService: FeatureService) {}

  public isFeatureToggled(feature: Feature) {}
}
