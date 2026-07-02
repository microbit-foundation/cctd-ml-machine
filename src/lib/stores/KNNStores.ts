/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';

/**
 * @deprecated Will be swapped for a training history. Remove in future
 */
export const knnHasTrained = writable<boolean>(false);
