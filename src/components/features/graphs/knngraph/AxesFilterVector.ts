/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type IArrow } from 'arrows-svg';
import { writable } from 'svelte/store';

export const vectorArrows = writable<IArrow[]>([]);
