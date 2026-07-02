/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AbstractState } from '../statemanagement/AbstractState';
import type { NotificationService } from '../application/notification/NotificationService';
import type { NotificationController } from './abstract/NotificationsController';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class MLMachineNotificationController implements NotificationController {
  private resetTimeout: ReturnType<typeof setTimeout> | undefined;
  public constructor(
    private notificationService: NotificationService,
    private states: AbstractStates,
  ) {}

  public clearSnackbarMessage(): void {
    this.notificationService.clearPopupMessage();
  }

  public getSnackbarMessage(): AbstractState<string | undefined> {
    return this.states.getPopupMessage();
  }

  public setSnackbarMessage(message: string): void {
    this.notificationService.setPopupMessage(message);
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    this.resetTimeout = setTimeout(() => {
      this.clearSnackbarMessage();
      this.resetTimeout = undefined;
    }, 5000);
  }
}
