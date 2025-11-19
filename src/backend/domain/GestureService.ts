/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Gesture, GestureID } from "../../core/entities/Gesture";
import type { RecordingData } from "../../core/entities/RecordingData";


export interface GestureService {
    saveGesture(gesture: Gesture): void;
    createGesture(name: string): Gesture;
    deleteRecording(gestureId: GestureID, recordingId: number): void;
    addRecording(gestureId: GestureID, recording: RecordingData): void;
    deleteGesture(gestureId: GestureID): void;
    setGestureName(gesture: GestureID, name: string): void;
    getGesture(id: GestureID): Gesture | undefined;
    setGestures(value: Gesture[]): void;
    getGestures(): Gesture[]
}
