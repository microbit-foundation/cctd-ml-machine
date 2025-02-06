/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export interface MLModel {
  predict(filteredData: number[]): Promise<number[]>;
}
