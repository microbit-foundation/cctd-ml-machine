/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitConnectionState } from '../../microbit/MicrobitConnectionState';

export class MicrobitConnectionStateImpl implements MicrobitConnectionState {
  constructor(
    private readonly connected: boolean,
    private readonly assigned: boolean,
    private readonly ready: boolean,
    private readonly outdated: boolean,
    private readonly initializing: boolean,
  ) {}

  isConnected(): boolean {
    return this.connected;
  }
  isAssigned(): boolean {
    return this.assigned;
  }
  isReady(): boolean {
    return this.ready;
  }
  isOutdated(): boolean {
    return this.outdated;
  }
  isInitializing(): boolean {
    return this.initializing;
  }
}
