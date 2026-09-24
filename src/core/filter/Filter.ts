/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export enum FilterType {
  MAX,
  MIN,
  MEAN,
  STD,
  PEAKS,
  ACC,
  ZCR,
  RMS,
}

export interface Filter {
  filter(inValues: number[]): number;

  getType(): FilterType;

  getName(): string;

  getDescription(): string;

  getMinNumberOfSamples(): number;
}
