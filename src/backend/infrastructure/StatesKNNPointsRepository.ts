import type { Vector } from "../../core/vector/Vector";
import type { KNNPointsRepository } from "../domain/KNNPointsRepository";
import type { AbstractStates } from "../statemanagement/AbstractStates";

export class StatesKNNPointsRepository implements KNNPointsRepository {
    constructor(private states: AbstractStates) {
    }

    saveInput(knnInput: Vector): void {
        this.states.getKNNInput().set(knnInput);
    }
}