/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitConnectionState } from './MicrobitConnectionState';
import type { MicrobitFlashing } from './MicrobitFlashing';
import type { MicrobitReconnectState } from './MicrobitReconnectState';
import type { MicrobitRole } from './MicrobitRole';

export interface MicrobitConnection {
  getFlashing(): MicrobitFlashing;
  setFlashingProgress(flashingProgress: number): void;
  setRequestWasCancelled(cancelled: boolean): void;
  clearReconnectOffering(): void;
  offerReconnect(role: MicrobitRole): void;
  getOutput(): MicrobitConnectionState;
  getInput(): MicrobitConnectionState;
  getReconnectState(): MicrobitReconnectState;
  wasDeviceRequestCancelled(): boolean;
  setInput(inputState: MicrobitConnectionState): void;
  setOutput(outputState: MicrobitConnectionState): void;
  setReconnection(reconnectState: MicrobitReconnectState): void;
}
