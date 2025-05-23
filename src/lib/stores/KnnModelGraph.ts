/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import type { Vector } from '../domain/Vector';
import type { LabelledPoint } from '../mlmodels/KNNNonNormalizedMLModel';

// TODO: Could be part of a greater 'currently predicted point' thing, that is updated by the engine.
export const knnCurrentPoint = writable<undefined | Vector>(undefined);

export const knnTrainingDataPoints = writable<LabelledPoint[]>([]);

export const knnNeighbours = writable<LabelledPoint[]>([]);
