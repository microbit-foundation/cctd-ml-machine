/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitConnection } from '../domain/microbit/MicrobitConnection';
import type { MicrobitRole } from '../domain/microbit/MicrobitRole';
import type { MicrobitService } from '../domain/microbit/MicrobitService';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class MicrobitController {
  public constructor(
    private microbitService: MicrobitService,
    private states: AbstractStates,
  ) {}

  public setFlashingProgress(progress: number): void {
    const connection = this.getMicrobitConnectionState().get();
    connection.setFlashingProgress(progress);
    this.setMicrobitConnection(connection);
  }

  public offerReconnect(role: MicrobitRole) {
    this.microbitService.offerReconnect(role);
  }

  public clearReconnectOffering(): void {
    this.microbitService.clearReconnectOffering();
  }

  public setRequestWasCancelled(cancelled: boolean): void {
    this.microbitService.setRequestWasCancelled(cancelled);
  }

  public setMicrobitConnection(connection: MicrobitConnection): void {
    this.microbitService.setMicrobitConnection(connection);
  }

  public getMicrobitConnectionState(): AbstractState<MicrobitConnection> {
    return this.states.getMicrobitConnection();
  }
}
