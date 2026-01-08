/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { LiveData } from '../../lib/domain/stores/LiveData';
import type { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { AbstractState } from './AbstractState';

export interface AbstractStates {
  getOutputTarget(): AbstractState<OutputTarget>;
  getLiveData(): AbstractState<LiveData<LiveDataVector>>;
}
