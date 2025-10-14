/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AbstractState } from "../application/data/AbstractState";

export interface NotificationService {
    getImmediateFeedbackMessage(): AbstractState<string | undefined>;
}