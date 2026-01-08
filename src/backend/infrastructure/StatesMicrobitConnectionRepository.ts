/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import ConsoleLogger from '../../core/logging/ConsoleLogger';
import { MicrobitConnectionImpl } from '../domain/implementation/microbit/MicrobitConnectionImpl';
import { MicrobitConnectionStateImpl } from '../domain/implementation/microbit/MicrobitConnectionStateImpl';
import { MicrobitReconnectStateImpl } from '../domain/implementation/microbit/MicrobitReconnectStateImpl';
import type { MicrobitConnection } from '../domain/microbit/MicrobitConnection';
import type { MicrobitConnectionRepository } from '../domain/microbit/MicrobitConnectionRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesMicrobitConnectionRepository implements MicrobitConnectionRepository {
  log: ConsoleLogger;

  constructor(private states: AbstractStates) {
    this.log = new ConsoleLogger('StatesMicrobitConnectionRepository');
  }

  public getMicrobitConnection(): MicrobitConnection {
    const stateData = this.states.getMicrobitConnection().get();

    const input = new MicrobitConnectionStateImpl(
      stateData.isInputConnected,
      stateData.isInputAssigned,
      stateData.isInputReady,
      stateData.isInputOutdated,
      stateData.isInputInitializing,
    );

    const output = new MicrobitConnectionStateImpl(
      stateData.isOutputConnected,
      stateData.isOutputAssigned,
      stateData.isOutputReady,
      stateData.isOutputOutdated,
      // output initializing not stored; assume false
      false,
    );

    const reconnect = new MicrobitReconnectStateImpl(
      stateData.offerReconnect,
      stateData.reconnectingRole,
    );
    const wasCancelled = !!stateData.requestDeviceWasCancelled;

    return new MicrobitConnectionImpl(input, output, reconnect, wasCancelled);
  }

  public setMicrobitConnection(microbitConnection: MicrobitConnection): void {
    const input = microbitConnection.getInput();
    const output = microbitConnection.getOutput();
    return this.states.getMicrobitConnection().set({
      isInputAssigned: input.isAssigned(),
      isInputConnected: input.isConnected(),
      isInputInitializing: input.isInitializing(),
      isInputOutdated: input.isOutdated(),
      isInputReady: input.isReady(),
      isOutputAssigned: output.isAssigned(),
      isOutputConnected: output.isConnected(),
      isOutputOutdated: output.isOutdated(),
      isOutputReady: output.isReady(),
      offerReconnect: microbitConnection.getReconnectState().isOfferingReconnect(),
      reconnectingRole: microbitConnection.getReconnectState().getMicrobitRole(),
      requestDeviceWasCancelled: microbitConnection.wasDeviceRequestCancelled(),
    });
  }
}
