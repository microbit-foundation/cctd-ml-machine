/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NotificationService } from "../../domain/NotificationService";
import type { AbstractState } from "../data/AbstractState";

export class StateNotificationService implements NotificationService {
    public constructor(
        private immediateFeedbackMessage: AbstractState<string | undefined>
    ) {}
    public getImmediateFeedbackMessage(): AbstractState<string | undefined> {
        return this.immediateFeedbackMessage;
    }
}