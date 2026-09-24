/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { MicrobitConnection } from '../domain/microbit/MicrobitConnection';
import type { MicrobitConnectionRepository } from '../domain/microbit/MicrobitConnectionRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesMicrobitConnectionRepository implements MicrobitConnectionRepository {
  log: ConsoleLogger;

  constructor(private states: AbstractStates) {
    this.log = new ConsoleLogger('StatesMicrobitConnectionRepository');
  }

  public getMicrobitConnection(): MicrobitConnection {
    return this.states.getMicrobitConnection().get();
  }

  public setMicrobitConnection(microbitConnection: MicrobitConnection): void {
    return this.states.getMicrobitConnection().set(microbitConnection);
  }
}
