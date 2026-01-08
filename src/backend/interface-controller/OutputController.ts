/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { OutputService } from '../domain/OutputService';
import type { AbstractStates } from '../statemanagement/AbstractStates';
import type { AbstractState } from '../statemanagement/AbstractState';

export class OutputController {
  public constructor(
    private outputService: OutputService,
    private states: AbstractStates,
  ) {}

  public getOutputTarget(): AbstractState<OutputTarget> {
    return this.states.getOutputTarget();
  }

  public setOutputTargetMakecode() {
    this.outputService.setOutputTarget(OutputTarget.MAKECODE);
  }
}
