/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { OutputRepository } from '../domain/OutputRepository';
import { OutputTarget } from '../domain/implementation/output/OutputTarget';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { Logger } from '../../core/logging/Logger';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesOutputRepository implements OutputRepository {
  private log: Logger;

  constructor(private states: AbstractStates) {
    this.log = new ConsoleLogger('InMemoryOutputRepository');
  }

  public getOutputTarget(): OutputTarget {
    return this.states.getOutputTarget().get();
  }

  public setOutputTarget(outputTarget: OutputTarget): void {
    this.log.log('setOutputTarget', outputTarget);
    return this.states.getOutputTarget().set(outputTarget);
  }
}
