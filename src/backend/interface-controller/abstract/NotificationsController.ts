/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AbstractState } from '../../statemanagement/AbstractState';

export interface NotificationController {
  getSnackbarMessage(): AbstractState<string | undefined>;
  clearSnackbarMessage(): void;
}
