/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AbstractState } from '../statemanagement/AbstractState';
import type { NotificationService } from '../domain/NotificationService';
import type { NotificationController } from './abstract/NotificationsController';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class MLMachineNotificationController implements NotificationController {
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
    setTimeout(() => {
      this.notificationService.clearPopupMessage();
    }, 5000);
  }
}
