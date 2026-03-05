/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MLModel } from '../../../core/model/MLModel';
import BaseVector from '../../../core/vector/BaseVector';
import type { Vector } from '../../../core/vector/Vector';

class TestMLModel implements MLModel {
  constructor(private numberOfGestures: number) {}

  // Predicts a random gesture as 100% confident
  predict(filteredData: Vector): Promise<Vector> {
    const result = new Array(this.numberOfGestures).fill(0) as number[];
    const predicted = Math.floor(Math.random() * this.numberOfGestures);
    result[predicted] = 1;
    return Promise.resolve(new BaseVector(result));
  }
}

export default TestMLModel;
