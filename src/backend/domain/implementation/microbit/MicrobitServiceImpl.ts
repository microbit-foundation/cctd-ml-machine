/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MicrobitConnection } from '../../microbit/MicrobitConnection';
import type { MicrobitConnectionRepository } from '../../microbit/MicrobitConnectionRepository';
import type { MicrobitRole } from '../../microbit/MicrobitRole';
import type { MicrobitService } from '../../microbit/MicrobitService';
import type { UserService } from '../../UserService';

export class MicrobitServiceImpl implements MicrobitService {
  constructor(
    private microbitConnectionRepository: MicrobitConnectionRepository,
    private userService: UserService,
  ) {}
  setMicrobitConnection(connection: MicrobitConnection): void {
    this.microbitConnectionRepository.setMicrobitConnection(connection);
  }
  clearReconnectOffering(): void {
    const connection = this.getMicrobitConnection();
    connection.clearReconnectOffering();
    this.microbitConnectionRepository.setMicrobitConnection(connection);
  }
  setRequestWasCancelled(cancelled: boolean): void {
    const connection = this.getMicrobitConnection();
    connection.setRequestWasCancelled(cancelled);
    this.microbitConnectionRepository.setMicrobitConnection(connection);
  }

  offerReconnect(role: MicrobitRole): void {
    this.userService.setShouldReconnectNextVisit(false);
    const connection = this.getMicrobitConnection();
    connection.offerReconnect(role);
    this.microbitConnectionRepository.setMicrobitConnection(connection);
  }

  getMicrobitConnection(): MicrobitConnection {
    return this.microbitConnectionRepository.getMicrobitConnection();
  }
}
