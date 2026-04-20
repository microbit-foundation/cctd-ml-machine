import type { NewGesture } from "../../core/entities/NewGesture";

export interface RecordingService {
    startRecording(gesture: NewGesture): Promise<void>;
    isRecording(): boolean;
    recordingGesture(): NewGesture | undefined;
}