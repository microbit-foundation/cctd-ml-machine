/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { UserService } from '../UserService';
import type { UserSessionRepository } from '../UserSessionRepository';

export class UserServiceImpl implements UserService {
  constructor(private sessionRepository: UserSessionRepository) {}

  setShouldReconnect(state: boolean) {
    this.sessionRepository.setShouldReconnect(state);
  }

  shouldReconnect(): boolean {
    return this.sessionRepository.shouldReconnect();
  }
}
