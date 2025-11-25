/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { GestureID } from "../../../../core/entities/Gesture";
import type { NewGesture } from "../../../../core/entities/NewGesture";
import type { RecordingData } from "../../../../core/entities/RecordingData";
import type { GestureRepository } from "../../GestureRepository";
import type { GestureService } from "../../GestureService";
import type { SystemColors } from "../SystemColors";
import { GestureImpl } from "./GestureImpl";

export class GestureServiceImpl implements GestureService {

    public constructor(
        private gestureRepository: GestureRepository,
        private colors: SystemColors
    ) { }

    public saveGesture(gesture: NewGesture): void {
        this.gestureRepository.saveGesture(gesture);
    }

    public createGesture(name: string): NewGesture {
        const id = this.gestureRepository.generateGestureId();
        const gesture = new GestureImpl(
            id,
            name,
            [],
            {},
            this.colors.generateGestureColor()
        )
        this.gestureRepository.saveGesture(gesture);
        return gesture;
    }

    public deleteRecording(gestureId: GestureID, recordingId: number): void {
        const gesture = this.getOrThrowGesture(gestureId);
        gesture.setRecordings([...gesture.getRecordings()].filter(rec => rec.ID !== recordingId));
        this.gestureRepository.saveGesture(gesture);
    }

    public addRecording(gestureId: number, recording: RecordingData): void {
        const gesture = this.getOrThrowGesture(gestureId)
        gesture.setRecordings([...gesture.getRecordings(), recording]);
    }

    public deleteGesture(gesture: GestureID): void {
        this.gestureRepository.removeGesture(gesture);
    }

    public setGestureName(gestureId: GestureID, name: string): void {
        const gesture = this.getOrThrowGesture(gestureId);
        gesture.setName(name);
        this.gestureRepository.saveGesture(gesture)
    }

    public getGesture(id: GestureID): NewGesture | undefined {
        return this.gestureRepository.getGesture(id);
    }

    public setGestures(value: NewGesture[]): void {
        this.gestureRepository.saveGestures(value);
    }

    public getGestures(): NewGesture[] {
        return this.gestureRepository.getGestures();
    }

    private getOrThrowGesture(gestureId: GestureID): NewGesture {
        const gesture = this.getGesture(gestureId);
        if (!gesture) {
            throw new Error(`Couldn't find gesture with id ${gestureId}`);
        }
        return gesture;
    }
}
