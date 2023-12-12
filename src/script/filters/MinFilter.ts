/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Filter from '../domain/Filter';

class MinFilter implements Filter {
  public filter(inValues: number[]): number {
    return Math.min(...inValues);
  }
}

export default MinFilter;
