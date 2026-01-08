/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitConnection } from '../../microbit/MicrobitConnection';
import type { MicrobitConnectionState } from '../../microbit/MicrobitConnectionState';
import type { MicrobitReconnectState } from '../../microbit/MicrobitReconnectState';
import type { MicrobitRole } from '../../microbit/MicrobitRole';
import { MicrobitReconnectStateImpl } from './MicrobitReconnectStateImpl';

export class MicrobitConnectionImpl implements MicrobitConnection {
  public constructor(
    private inputState: MicrobitConnectionState,
    private outputState: MicrobitConnectionState,
    private reconnectState: MicrobitReconnectState,
    private wasRequestCancelled: boolean,
  ) {}
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
