/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureValue } from './FeatureValue';

export class NumberFeature implements FeatureValue<number> {
  public constructor(private value: number | undefined | null) {}

  public getValue(): number {
    return this.value ?? 0;
  }

  public isSet(): boolean {
    return this.value !== undefined && this.value !== null;
  }
}
