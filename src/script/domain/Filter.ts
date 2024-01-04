/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { FilterType } from './FilterTypes';

interface Filter {
  filter(inValues: number[]): number;

  getType(): FilterType;

  getName(): string;

  getDescription(): string;
}

export default Filter;
