/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NotificationRepository } from "./NotificationRepository";
import type { NotificationService } from "./NotificationService";


export class NotificationServiceImpl implements NotificationService {
  public constructor(private notificationRepository: NotificationRepository) {}

  setPopupMessage(message: string): void {
    this.notificationRepository.setPopupMessage(message);
  }

  public clearPopupMessage(): void {
    this.notificationRepository.setPopupMessage(undefined);
  }

  public getPopupMessage(): string | undefined {
    return this.notificationRepository.getPopupMessage();
  }
}
