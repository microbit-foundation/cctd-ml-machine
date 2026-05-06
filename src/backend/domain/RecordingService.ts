import type { NewGesture } from '../../core/entities/NewGesture';
import type { Recording } from '../../core/entities/recording/Recording';

export interface RecordingService {
  startRecording(gesture: NewGesture): Promise<Recording>;
  isRecording(): boolean;
  recordingGesture(): NewGesture | undefined;
}
