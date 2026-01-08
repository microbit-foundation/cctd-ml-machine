/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitConnection } from './MicrobitConnection';
import type { MicrobitRole } from './MicrobitRole';

export interface MicrobitService {
  offerReconnect(role: MicrobitRole): void;
  getMicrobitConnection(): MicrobitConnection;
}
