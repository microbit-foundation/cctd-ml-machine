import type { NewGesture } from "../../../core/entities/NewGesture";
import type { RecordingService } from "../RecordingService";

export class RecordingServiceImpl implements RecordingService {
    startRecording(gesture: NewGesture): Promise<void> {
        throw new Error("Method not implemented.");
    }
    isRecording(): boolean {
        throw new Error("Method not implemented.");
    }
    recordingGesture(): NewGesture | undefined {
        throw new Error("Method not implemented.");
    }
}