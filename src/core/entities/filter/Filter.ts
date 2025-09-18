/**
 * (c) 2023-2025, center for computational thinking and design at aarhus university and contributors
 *
 * spdx-license-identifier: mit
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
