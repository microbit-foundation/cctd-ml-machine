/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MLModel } from '../../../lib/domain/MLModel';
import type { Vector } from '../../../lib/domain/Vector';

class TestMLModel implements MLModel {
  constructor(private numberOfGestures: number) {}

  // Predicts a random gesture as 100% confident
  predict(filteredData: Vector): Promise<number[]> {
    const result = new Array(this.numberOfGestures).fill(0) as number[];
    const predicted = Math.floor(Math.random() * this.numberOfGestures);
    result[predicted] = 1;
    return Promise.resolve(result);
  }
}

export default TestMLModel;
