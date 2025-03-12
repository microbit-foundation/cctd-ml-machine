import type { RecordingData } from "./RecordingData";
import type { GestureID } from "./stores/gesture/Gesture";

export interface ValidationSet {
    gestureId: GestureID;
    recordings: RecordingData[]
}