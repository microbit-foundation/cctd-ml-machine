/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitReconnectState } from '../../microbit/MicrobitReconnectState';
import type { MicrobitRole } from '../../microbit/MicrobitRole';

export class MicrobitReconnectStateImpl implements MicrobitReconnectState {
  constructor(
    private offeringReconnect: boolean,
    private microbitRole: MicrobitRole,
  ) {}

  isOfferingReconnect(): boolean {
    return this.offeringReconnect;
  }
  getMicrobitRole(): MicrobitRole {
    return this.microbitRole;
  }
}
