/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { IArrow } from 'arrows-svg';
import { writable } from 'svelte/store';

export const vectorArrows = writable<IArrow[]>([]);
