import type { Confidences } from "../../core/entities/Confidences";
import type { ConfidenceRepository } from "../domain/ConfidenceRepository";
import type { AbstractStates } from "../statemanagement/AbstractStates";

export class StatesConfidenceRepository implements ConfidenceRepository {
    public constructor(private states: AbstractStates) { }

    public getConfidences(): Confidences {
        return this.states.getConfidences().get();
    }

    public setConfidences(confidence: Confidences): void {
        this.states.getConfidences().set(confidence);
    }
}