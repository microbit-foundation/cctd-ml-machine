import type { Vector } from "../../core/vector/Vector";

export interface KNNPointsRepository {
    saveInput(knnInput: Vector): void;
}