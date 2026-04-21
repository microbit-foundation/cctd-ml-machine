import type { Axis } from "../../../core/entities/Axis";
import type { NewGesture } from "../../../core/entities/NewGesture";
import { RecordingImpl } from "../../../core/entities/recording/RecordingImpl";
import { Sample } from "../../../core/entities/recording/Sample";
import type { LiveDataVector } from "../../../core/vector/LiveDataVector";
import type { DataService } from "../DataService";
import type { GestureService } from "../GestureService";
import type { RecordingSettings } from "../recording/RecordingSettings";
import type { RecordingService } from "../RecordingService";
import type { RecordingSettingsRepository } from "../RecordingSettingsRepository";
import type { RecordingStateRepository } from "../RecordingStateRepository";

export class RecordingServiceImpl implements RecordingService {

    constructor(private recordingStateRepository: RecordingStateRepository, private recordingSettingsRepository: RecordingSettingsRepository, private gestureService: GestureService, private dataService: DataService) {
    }

    startRecording(gesture: NewGesture): Promise<void> {
        const state = this.recordingStateRepository.getRecordingState();
        state.setRecording(true);
        state.setRecordingGesture(gesture);
        this.recordingStateRepository.setRecordingState(state);

        const settings = this.recordingSettingsRepository.getRecordingSettings();
        setTimeout(() => {
            const recordingRaw = this.getBufferedRecordingData(settings);
            const axes = recordingRaw[0].getLabels().map((label, index) => ({ label, index } as Axis))
            const samples = recordingRaw.map(rawSampleVector => {
                return new Sample(rawSampleVector);
            })

            const recording = new RecordingImpl(Date.now(), samples, axes)
            this.gestureService.addRecording(gesture.getID(), recording);
        }, settings.getRecordingDuration())
    
        state.setRecording(false);
        state.setRecordingGesture(undefined);
        this.recordingStateRepository.setRecordingState(state);
        return Promise.resolve();
    }

    isRecording(): boolean {
        return this.recordingStateRepository.getRecordingState().isRecording();
    }

    recordingGesture(): NewGesture | undefined {
        return this.recordingStateRepository.getRecordingState().getRecordingGesture();
    }

    private getBufferedRecordingData(settings: RecordingSettings): LiveDataVector[] {
        const recordingRaw = this.dataService.getLiveData(settings.getRecordingDuration(), settings.getMinNoOfSamples())
        if (recordingRaw.length === 0) {
            throw new Error("No data recorded");
        }
        return recordingRaw;
    }
}