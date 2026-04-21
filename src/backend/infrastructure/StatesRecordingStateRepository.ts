import type { GestureRecordingState } from "../domain/recording/GestureRecordingState";
import type { RecordingStateRepository } from "../domain/RecordingStateRepository";
import type { AbstractStates } from "../statemanagement/AbstractStates";

export class StatesRecordingStateRepository implements RecordingStateRepository {
    constructor(private states: AbstractStates) {

    }
    getRecordingState(): GestureRecordingState {
        return this.states.getRecordingState().get();
    }
    setRecordingState(state: GestureRecordingState): void {
        this.states.getRecordingState().set(state);
    }
}