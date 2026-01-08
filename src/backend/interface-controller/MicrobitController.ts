/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitRole } from '../domain/microbit/MicrobitRole';
import type { MicrobitService } from '../domain/microbit/MicrobitService';
import type { MicrobitConnectionData } from '../infrastructure/MicrobitConnectionData';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class MicrobitController {
  public constructor(
    private microbitService: MicrobitService,
    private states: AbstractStates,
  ) {}

  public offerReconnect(role: MicrobitRole) {
    this.microbitService.offerReconnect(role);
  }

  public getMicrobitConnectionState(): AbstractState<MicrobitConnectionData> {
    return this.states.getMicrobitConnection();
  }
}
