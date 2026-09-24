/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface KNNModelSettings {
  getK(): number;
  getNumberOfClasses(): number;
  shouldNormalize(): boolean;
  setK(k: number): void;
  setNumberOfClasses(numberOfClasses: number): void;
  setNormalize(normalize: boolean): void;
}
