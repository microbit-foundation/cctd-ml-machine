/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import Gesture from '../domain/stores/gesture/Gesture';

// Store for current gestures
// TODO: Move this elsewhere
export const chosenGesture = writable<Gesture | null>(null);
