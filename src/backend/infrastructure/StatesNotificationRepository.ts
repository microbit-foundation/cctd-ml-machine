/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NotificationRepository } from '../application/notification/NotificationRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesNotificationRepository implements NotificationRepository {
  constructor(private states: AbstractStates) {}

  setPopupMessage(message: string | undefined): void {
    this.states.getPopupMessage().set(message);
  }
  getPopupMessage(): string | undefined {
    return this.states.getPopupMessage().get();
  }
}
