import type { Vector } from '../../core/vector/Vector';
import type { LabelledPoint } from '../../lib/legacy/KNNNonNormalizedMLModel';

export interface KNNPointsRepository {
  saveInput(knnInput: Vector): void;

  saveNearestNeighbours(points: LabelledPoint[]): void;
}
