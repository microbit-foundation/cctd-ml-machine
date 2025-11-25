/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from "../../core/entities/Gesture";
import type { NewGesture } from "../../core/entities/NewGesture";
import type { RecordingData } from "../../core/entities/RecordingData";


export interface GestureService {
    saveGesture(gesture: NewGesture): void;
    createGesture(name: string): NewGesture;
    deleteRecording(gestureId: GestureID, recordingId: number): void;
    addRecording(gestureId: GestureID, recording: RecordingData): void;
    deleteGesture(gestureId: GestureID): void;
    setGestureName(gesture: GestureID, name: string): void;
    getGesture(id: GestureID): NewGesture | undefined;
    setGestures(value: NewGesture[]): void;
    getGestures(): NewGesture[]
}
