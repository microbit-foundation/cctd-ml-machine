/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { DeviceRequestState } from '../../../application/devices/DeviceRequestState';
import type { MicrobitConnection } from '../../microbit/MicrobitConnection';
import type { MicrobitConnectionState } from '../../microbit/MicrobitConnectionState';
import type { MicrobitFlashing } from '../../microbit/MicrobitFlashing';
import type { MicrobitReconnectState } from '../../microbit/MicrobitReconnectState';
import { MicrobitRole } from '../../microbit/MicrobitRole';
import MicrobitFlashingImpl from './MicrobitFlashingImpl';
import { MicrobitReconnectStateImpl } from './MicrobitReconnectStateImpl';

export class MicrobitConnectionImpl implements MicrobitConnection {
  private flashing: MicrobitFlashing;
  private deviceRequestState: DeviceRequestState = DeviceRequestState.NONE;

  public constructor(
    private inputState: MicrobitConnectionState,
    private outputState: MicrobitConnectionState,
    private reconnectState: MicrobitReconnectState,
    private wasRequestCancelled: boolean,
  ) {
    this.flashing = new MicrobitFlashingImpl();
  }
  getDeviceRequestState(): DeviceRequestState {
    return this.deviceRequestState;
  }
  setDeviceRequestState(state: DeviceRequestState): void {
    this.deviceRequestState = state;
  }
  getFlashing(): MicrobitFlashing {
    return this.flashing;
  }
  setFlashingProgress(flashingProgress: number): void {
    this.flashing.setFlashingProgress(flashingProgress);
    this.flashing.setFlashing(flashingProgress < 1);
  }
  setRequestWasCancelled(cancelled: boolean): void {
    this.wasRequestCancelled = cancelled;
  }
  clearReconnectOffering(): void {
    this.reconnectState = new MicrobitReconnectStateImpl(
      false,
      this.reconnectState.getMicrobitRole(),
    );
  }
  setInput(inputState: MicrobitConnectionState): void {
    this.inputState = inputState;
  }
  setOutput(outputState: MicrobitConnectionState): void {
    this.outputState = outputState;
  }
  setReconnection(reconnectState: MicrobitReconnectState): void {
    this.reconnectState = reconnectState;
  }
  offerReconnect(role: MicrobitRole): void {
    this.reconnectState = new MicrobitReconnectStateImpl(true, role);
  }
  getOutput(): MicrobitConnectionState {
    return this.outputState;
  }
  getInput(): MicrobitConnectionState {
    return this.inputState;
  }
  getReconnectState(): MicrobitReconnectState {
    return this.reconnectState;
  }
  wasDeviceRequestCancelled(): boolean {
    return this.wasRequestCancelled;
  }
}
