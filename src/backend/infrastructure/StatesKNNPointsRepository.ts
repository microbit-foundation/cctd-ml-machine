/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Vector } from '../../core/vector/Vector';
import type { LabelledPoint } from '../../lib/legacy/KNNNonNormalizedMLModel';
import type { KNNPointsRepository } from '../domain/KNNPointsRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesKNNPointsRepository implements KNNPointsRepository {
  constructor(private states: AbstractStates) {}

  saveNearestNeighbours(points: LabelledPoint[]): void {
    this.states.getKNNNearestNeighbours().set(points);
  }

  saveInput(knnInput: Vector): void {
    this.states.getKNNInput().set(knnInput);
  }
}
