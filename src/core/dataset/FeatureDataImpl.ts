/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Vector } from '../vector/Vector';
import type { FeatureData } from './FeatureData';

export class FeatureDataImpl implements FeatureData {
  constructor(private features: Vector) {}

  getFeatures(): Vector {
    return this.features;
  }
}
