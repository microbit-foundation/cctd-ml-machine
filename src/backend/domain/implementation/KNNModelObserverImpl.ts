/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { KNNModelObserver } from '../../../core/model/KNN/KNNModelObserver';
import type { LabelledPoint } from '../../../core/model/KNN/LabelledPoint';
import type { Vector } from '../../../core/vector/Vector';
import type { KNNPointsRepository } from '../KNNPointsRepository';

export class KNNModelObserverImpl implements KNNModelObserver {
  constructor(private pointsRepository: KNNPointsRepository) {}

  onInputComputed(knnInput: Vector): void {
    this.pointsRepository.saveInput(knnInput);
  }

  onNearestNeighboursFound(points: LabelledPoint[]): void {
    this.pointsRepository.saveNearestNeighbours(points);
  }
}
