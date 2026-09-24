/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitConnection } from './MicrobitConnection';

export interface MicrobitConnectionRepository {
  getMicrobitConnection(): MicrobitConnection;
  setMicrobitConnection(microbitConnection: MicrobitConnection): void;
}
