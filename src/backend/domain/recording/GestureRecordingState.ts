import type { NewGesture } from "../../../core/entities/NewGesture";

export class GestureRecordingState {
    constructor(private recording: boolean, private recordingGesture: NewGesture | undefined) {
    }

    isRecording(): boolean {
        return this.recording;
    }

    getRecordingGesture(): NewGesture | undefined {
        return this.recordingGesture;
    }
}