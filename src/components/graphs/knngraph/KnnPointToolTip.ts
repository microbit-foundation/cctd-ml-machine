/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { writable } from 'svelte/store';
import { DrawablePoint } from './KNNModelGraphDrawer';

export const knnHighlightedPoint = writable<DrawablePoint | undefined>(undefined);
