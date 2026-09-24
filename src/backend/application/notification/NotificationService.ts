/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface NotificationService {
  setPopupMessage(message: string): void;
  getPopupMessage(): string | undefined;
  clearPopupMessage(): void;
}
