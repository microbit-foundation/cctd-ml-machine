/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { derived } from 'svelte/store';
import Matrix from '../../core/entities/Matrix';
import { stores } from '../../lib/stores/Stores';

export interface ValidationSetMatrix {
  matrix: Matrix<number>;
  accurateResults: number;
}

export const isValidationSetEmpty = derived(
  stores.getValidationSets(),
  validationSets => {
    return validationSets.reduce((pre, cur) => pre + cur.recordings.length, 0) === 0;
  },
);
