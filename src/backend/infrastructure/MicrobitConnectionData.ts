/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitRole } from '../domain/microbit/MicrobitRole';

export interface MicrobitConnectionData {
  isInputConnected: boolean;
  isOutputConnected: boolean;
  offerReconnect: boolean;
  requestDeviceWasCancelled: boolean;
  reconnectingRole: MicrobitRole;
  isInputReady: boolean;
  isInputAssigned: boolean;
  isOutputAssigned: boolean;
  isOutputReady: boolean;
  isInputInitializing: boolean;
  isInputOutdated: boolean;
  isOutputOutdated: boolean;
}
