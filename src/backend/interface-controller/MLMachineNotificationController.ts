/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AbstractState } from '../interface-adapter/AbstractState';
import type { NotificationService } from '../domain/NotificationService';
import type { NotificationController } from './abstract/NotificationsController';

export class MLMachineNotificationController implements NotificationController {
  public constructor(private notificationService: NotificationService) {}

  public clearSnackbarMessage(): void {
    this.notificationService.clearImmediateMessage();
  }

  public getSnackbarMessage(): AbstractState<string | undefined> {
    return this.notificationService.getImmediateFeedbackMessage();
  }
}
