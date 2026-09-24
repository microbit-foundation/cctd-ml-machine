/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureValue } from './FeatureValue';

export class BooleanFeature implements FeatureValue<boolean> {
  public constructor(private value: boolean | undefined | null) {}

  public getValue(): boolean {
    return this.value ?? false;
  }

  public isSet(): boolean {
    return this.value ?? false;
  }
}
