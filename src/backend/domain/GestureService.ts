/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Gesture, GestureID } from "../../core/entities/Gesture";


export interface GestureService {
    getGesture(id: GestureID): Gesture | undefined;
    setGestures(value: Gesture[]): void;
    getGestures(): Gesture[]
}
