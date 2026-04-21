import type { NewGesture } from "../../core/entities/NewGesture";
import type { GestureRecordingState } from "../domain/recording/GestureRecordingState";
import type { RecordingSettings } from "../domain/recording/RecordingSettings";
import type { RecordingService } from "../domain/RecordingService";
import type { AbstractState } from "../statemanagement/AbstractState";
import type { AbstractStates } from "../statemanagement/AbstractStates";

export class RecordingController {
    constructor(private recordingService: RecordingService, private states: AbstractStates) {
    }

    startRecording(gesture: NewGesture): Promise<void> {
        return this.recordingService.startRecording(gesture);
    }

    public getRecordingState(): AbstractState<GestureRecordingState> {
        return this.states.getRecordingState();
    }

    public getRecordingSettings(): AbstractState<RecordingSettings> {
        return this.states.getRecordingSettings();
    }
}