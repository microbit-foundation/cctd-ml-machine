import type { GestureID } from '../../entities/Gesture';
import type { GestureOutput } from '../../entities/GestureOutput';
import type { SerializedRecording } from './SerializedRecording';

export interface SerializedGesture {
  ID: GestureID;
  name: string;
  output: GestureOutput;
  color: string;
  recordings: SerializedRecording[];
  validationRecordings: SerializedRecording[];
}
