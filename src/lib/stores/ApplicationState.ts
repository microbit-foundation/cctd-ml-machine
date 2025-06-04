/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';

export enum ModelView {
  TILE,
  STACK,
}

export const modelView = writable<ModelView>(ModelView.STACK);

export const isLoading = writable<boolean>(true);
