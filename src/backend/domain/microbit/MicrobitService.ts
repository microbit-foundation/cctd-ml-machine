/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { DeviceRequestState } from '../../application/devices/DeviceRequestState';
import type { MicrobitConnection } from './MicrobitConnection';
import type { MicrobitRole } from './MicrobitRole';

export interface MicrobitService {
  setDeviceRequestState(state: DeviceRequestState): void;
  getDeviceRequestState(): DeviceRequestState;
  setMicrobitConnection(connection: MicrobitConnection): void;
  offerReconnect(role: MicrobitRole): void;
  clearReconnectOffering(): void;
  getMicrobitConnection(): MicrobitConnection;
  setRequestWasCancelled(cancelled: boolean): void;
}
