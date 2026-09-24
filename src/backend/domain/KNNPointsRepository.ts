/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Vector } from '../../core/vector/Vector';
import type { LabelledPoint } from '../../core/model/KNN/LabelledPoint';

export interface KNNPointsRepository {
  saveInput(knnInput: Vector): void;

  saveNearestNeighbours(points: LabelledPoint[]): void;
}
