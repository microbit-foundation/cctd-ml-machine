/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface AppController {
  setReconnectFlag(state: boolean): unknown;
  getDocumentTitle(): string;
  isReconnectFlagSet(): boolean;
  unsetReconnectFlag(): void;
}
