/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Confidence } from "../../../../core/entities/Confidence";
import type { Gesture, GestureID } from "../../../../core/entities/Gesture";
import type { GestureOutput } from "../../../../core/entities/GestureOutput";
import type { RecordingData } from "../../../../core/entities/RecordingData";


export class GestureImpl implements Gesture {

    public constructor(
        private id: GestureID,
        private name: string,
        private recordings: RecordingData[],
        private ouput: GestureOutput,
        private color: string,
    ) {}
    setOutput(ouput: GestureOutput): void {
        this.ouput = ouput;
    }
    
    setRecordings(recordings: RecordingData[]): void {
        this.recordings = recordings;
    }

    setName(name: string): void {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }
    getID(): GestureID {
        return this.id;
    }
    getRecordings(): RecordingData[] {
        return this.recordings;
    }
    getOutput(): GestureOutput {
        return this.ouput;
    }
    getColor(): string {
        return this.color;
    }
    getConfidence(): Confidence {
        return {
            currentConfidence: 0,
            isConfident: false,
            requiredConfidence: 1
        };
    }

}
