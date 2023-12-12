/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import FilterWithMaths from './FilterWithMaths';

class StandardDeviationFilter extends FilterWithMaths {
  public filter(inValues: number[]): number {
    const mean = this.mean(inValues);
    return Math.sqrt(
      inValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / inValues.length,
    );
  }
}

export default StandardDeviationFilter;
