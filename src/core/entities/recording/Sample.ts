import BaseVector from '../../vector/BaseVector';
import type { Vector } from '../../vector/Vector';

export class Sample extends BaseVector {
  constructor(vector: number[] | Vector) {
    if (Array.isArray(vector)) {
      super(vector);
    } else {
      super(vector.getValue());
    }
  }
}
