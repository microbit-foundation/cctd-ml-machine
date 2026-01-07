/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { AbstractState } from '../interface-adapter/AbstractState';

export interface AbstractStates {
  getOutputTarget(): AbstractState<OutputTarget>;
}
