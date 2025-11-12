/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Gesture } from "../../../../core/entities/Gesture";
import type { GestureRepository } from "../../GestureRepository";
import type { GestureService } from "../../GestureService";


export class GestureServiceImpl implements GestureService {

    public constructor(
        private gestureRepository: GestureRepository
    ) { }

    setGestures(value: Gesture[]): void {
        this.gestureRepository.saveGestures(value);
    }

    public getGestures(): Gesture[] {
        return this.gestureRepository.getGestures();
    }

}
