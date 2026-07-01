import { describe, test, expect } from 'vitest';
import { AccuracyMatrixFactory } from '../../core/classifier/AccuracyMatrixFactory';
import BaseVector from '../../core/vector/BaseVector';

class SimpleLabels {
  private vectors: BaseVector[];
  constructor(vectors: number[][]) {
    this.vectors = vectors.map(v => new BaseVector(v));
  }
  getLabelVectors() {
    return this.vectors;
  }
  getIndexLabels() {
    throw new Error('Not needed for test');
  }
}

class SimplePrediction {
  constructor(private vec: BaseVector) {}
  getPrediction() {
    return this.vec;
  }
}

describe('AccuracyMatrixFactory', () => {
  test('creates correct confusion matrix for perfect predictions', () => {
    const gestureIndexMap = new Map<number, number>();
    gestureIndexMap.set(0, 0);
    gestureIndexMap.set(1, 1);

    const factory = new AccuracyMatrixFactory();

    const labels = new SimpleLabels([
      [1, 0],
      [0, 1],
    ]);

    const outputs = [
      new SimplePrediction(new BaseVector([1, 0])),
      new SimplePrediction(new BaseVector([0, 1])),
    ];

    const matrix = factory.create(2, labels as any, outputs as any);

    expect(matrix.getRow(0)).toEqual([1, 0]);
    expect(matrix.getRow(1)).toEqual([0, 1]);
  });

  test('throws on labels/outputs length mismatch', () => {
    const gestureIndexMap = new Map<number, number>();
    gestureIndexMap.set(0, 0);

    const factory = new AccuracyMatrixFactory();
    const labels = new SimpleLabels([[1]]);
    const outputs = [
      new SimplePrediction(new BaseVector([1])),
      new SimplePrediction(new BaseVector([1])),
    ];

    expect(() => factory.create(2, labels as any, outputs as any)).toThrow();
  });
});
