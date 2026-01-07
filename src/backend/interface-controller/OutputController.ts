/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { OutputService } from '../domain/OutputService';
import type { AbstractStates } from '../infrastructure/AbstractStates';
import type { AbstractState } from '../interface-adapter/AbstractState';

export class OutputController {
  public constructor(
    private outputService: OutputService,
    private states: AbstractStates,
  ) {}

  public getOutputTarget(): AbstractState<OutputTarget> {
    return this.states.getOutputTarget();
  }
}
