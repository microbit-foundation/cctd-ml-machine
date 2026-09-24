/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureValue } from './FeatureValue';

export class StringFeature implements FeatureValue<string> {
  public constructor(private value: string | undefined | null) {}

  public getValue(): string {
    return this.value ?? '';
  }

  public isSet(): boolean {
    return !!this.value;
  }
}
