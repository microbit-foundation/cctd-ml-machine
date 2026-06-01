/**
 * AccuracyMatrix
 *
 * Holds a confusion matrix for a classifier. Rows correspond to true labels
 * and columns correspond to predicted labels. Labels are identified by
 * numeric indices and provided at construction time. A row can be
 * retrieved by supplying an index.
 */

import Matrix from '../entities/Matrix';

export class AccuracyMatrix {
	private labels: number[];
	private indexMap: Map<number, number>;
	private matrix: number[][];

	/**
	 * Construct from a square confusion `Matrix<number>`. Labels are derived as
	 * gesture ids equal to row indices: 0..n-1.
	 */
	constructor(matrix: Matrix<number>) {
		const values = matrix.getValues();
		if (!values || values.length === 0) throw new Error('Matrix must not be empty');
		const n = values.length;
		for (const row of values) {
			if (row.length !== n) throw new Error('Matrix must be square');
		}
		this.matrix = values.map((r) => r.slice());
		this.labels = Array.from({ length: n }, (_, i) => i);
		this.indexMap = new Map<number, number>();
		for (let i = 0; i < this.labels.length; i++) this.indexMap.set(this.labels[i], i);
	}

	static fromSize(size: number): AccuracyMatrix {
		const values = Array.from({ length: size }, () => Array(size).fill(0));
		return new AccuracyMatrix(new Matrix<number>(values));
	}

	getLabels(): number[] {
		return this.labels.slice();
	}

	private getIndex(id: number): number {
		const idx = this.indexMap.get(id);
		if (idx === undefined) throw new Error(`Unknown label index: ${id}`);
		return idx;
	}

	increment(trueIndex: number, predictedIndex: number, count = 1): void {
		const r = this.getIndex(trueIndex);
		const c = this.getIndex(predictedIndex);
		this.matrix[r][c] += count;
	}

	set(trueIndex: number, predictedIndex: number, value: number): void {
		const r = this.getIndex(trueIndex);
		const c = this.getIndex(predictedIndex);
		this.matrix[r][c] = value;
	}

	get(trueIndex: number, predictedIndex: number): number {
		const r = this.getIndex(trueIndex);
		const c = this.getIndex(predictedIndex);
		return this.matrix[r][c];
	}
	/**
	 * Return a copy of the confusion-matrix row for the given `gestureId`.
	 */
	getRow(index: number): number[] {
		const r = this.getIndex(index);
		return this.matrix[r].slice();
	}

	toArray(): number[][] {
		return this.matrix.map((row) => row.slice());
	}
}

export default AccuracyMatrix;

