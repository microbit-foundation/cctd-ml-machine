/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import ControlledStorage from '../../frontend/lib/ControlledStorage';
import type { UserSessionRepository } from '../domain/UserSessionRepository';

export class LocalStorageUserSessionRepository implements UserSessionRepository {
  private readonly RECONNECT_FLAG_KEY = 'reconnect_flag';

  public setShouldReconnect(state: boolean): void {
    ControlledStorage.set<boolean>(this.RECONNECT_FLAG_KEY, state);
  }

  public shouldReconnect(): boolean {
    return ControlledStorage.getOrElse<boolean>(this.RECONNECT_FLAG_KEY, false);
  }
}
