/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NotificationService } from '../../NotificationService';
import type { AbstractState } from '../../../interface-adapter/AbstractState';

// TODO: Replace with notifier service calls. Uses observer pattern for state management!
export class StateNotificationService implements NotificationService {
  public constructor(
    private immediateFeedbackMessage: AbstractState<string | undefined>,
  ) {}

  public clearImmediateMessage(): void {
    this.immediateFeedbackMessage.set(undefined);
  }

  public getImmediateFeedbackMessage(): AbstractState<string | undefined> {
    return this.immediateFeedbackMessage;
  }
}
