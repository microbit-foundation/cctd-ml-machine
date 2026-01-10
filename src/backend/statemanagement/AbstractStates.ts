/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { LiveDataStore } from '../../core/LiveDataStore';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { MicrobitConnection } from '../domain/microbit/MicrobitConnection';
import type { AbstractState } from './AbstractState';

export interface AbstractStates {
  getOutputTarget(): AbstractState<OutputTarget>;
  getLiveData(): AbstractState<LiveDataStore<LiveDataVector>>;
  getMicrobitConnection(): AbstractState<MicrobitConnection>;
}
