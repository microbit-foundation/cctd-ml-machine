/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { FilterType } from './FilterTypes';

export interface Filter {
  filter(inValues: number[]): number;

  getType(): FilterType;

  getName(): string;

  getDescription(): string;

  getMinNumberOfSamples(): number;
}
