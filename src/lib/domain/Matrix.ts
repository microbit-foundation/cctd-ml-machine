/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

class Matrix<T> {
  private matrix: T[][];

  public constructor(matrix: T[][]) {
    this.matrix = matrix;
  }

  public getValues(): T[][] {
    return this.matrix;
  }

  public getRow(rowIndex: number): T[] {
    if (this.matrix.length <= rowIndex) {
      throw new Error(
        `There are not enough rows(${this.matrix.length}) to get row with index ${rowIndex}`,
      );
    }

    return this.matrix[rowIndex];
  }

  public getColumn = (columnIndex: number): T[] => {
    return this.matrix.map((row, rowIdx) => {
      if (row.length <= columnIndex) {
        throw new Error(
          `Cannot get columns for matrix ${this.matrix} there's not enough columns (${columnIndex}) in row ${rowIdx}`,
        );
      }
      return row[columnIndex];
    });
  };

  public transposed(): Matrix<T> {
    return new Matrix(
      this.matrix[0].map((_, colIndex) => this.matrix.map(row => row[colIndex])),
    );
  }
}

export default Matrix;
