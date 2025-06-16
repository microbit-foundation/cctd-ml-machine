/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from "svelte/store";
import type { RecordingData } from "../../lib/domain/RecordingData";
import Gesture from "../../lib/domain/stores/gesture/Gesture";
import type { PersistedGestureData } from "../../lib/domain/stores/gesture/Gestures";
import type GestureConfidence from "../../lib/domain/stores/gesture/GestureConfidence";
import { serializeGestureRecordingsToCSV } from "../../lib/utils/CSVUtils";

describe('CSV Test', () => {
    // A crude way to enforce direction of dependencies, inspired by ArchUnit for java
    test('Convert recording', () => {
        const input: RecordingData = {
            ID: 123,
            labels: ["x", "y", "z"],
            samples: [{
                vector: [1, 2, 3],
            }, {
                vector: [4, 5, 6],
            }, {
                vector: [7, 8, 9],
            }]
        }
        const data = writable({recordings:[input], name:"Test;Gesture"} as PersistedGestureData);
        const confidence = writable({}) as unknown as GestureConfidence;
        const gesture: Gesture = new Gesture(data, confidence, () => void 0);
        const result = serializeGestureRecordingsToCSV([gesture]);
        expect(result).toBe("gesture;sample;x;y;z\nTest\\;Gesture;0;1;2;3\nTest\\;Gesture;1;4;5;6\nTest\\;Gesture;2;7;8;9");
    });

    test('Convert multiple gestures', () => {
        const input1: RecordingData = {
            ID: 123,
            labels: ["x", "y", "z"],
            samples: [{
                vector: [1, 2, 3],
            }, {
                vector: [4, 5, 6],
            }]
        };
        const input2: RecordingData = {
            ID: 456,
            labels: ["x", "y", "z"],
            samples: [{
                vector: [7, 8, 9],
            }, {
                vector: [10, 11, 12],
            }]
        };
        const data1 = writable({recordings:[input1], name:"Gesture1"} as PersistedGestureData);
        const data2 = writable({recordings:[input2], name:"Gesture2"} as PersistedGestureData);
        const confidence = writable({}) as unknown as GestureConfidence;
        const gesture1: Gesture = new Gesture(data1, confidence, () => void 0);
        const gesture2: Gesture = new Gesture(data2, confidence, () => void 0);
        const result = serializeGestureRecordingsToCSV([gesture1, gesture2]);
        expect(result).toBe(
            "gesture;sample;x;y;z\n" +
            "Gesture1;0;1;2;3\n" +
            "Gesture1;1;4;5;6\n" +
            "Gesture2;0;7;8;9\n" +
            "Gesture2;1;10;11;12"
        );
    });
});
