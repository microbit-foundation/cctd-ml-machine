/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AbstractState } from '../../interface-adapter/AbstractState';
import type { DevicesType } from '../../application/devices/Devices';

export interface AppController {
  setReconnectFlag(state: boolean): unknown;
  getDocumentTitle(): string;
  // TODO; Should be a domain entity, but it's too large for refactoring now
  getDevices(): AbstractState<DevicesType>;
  isReconnectFlagSet(): boolean;
  unsetReconnectFlag(): void;
}
