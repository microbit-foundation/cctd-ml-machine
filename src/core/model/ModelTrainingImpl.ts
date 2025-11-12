/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { ModelTraining } from "./ModelTraining";

export class ModelTrainingImpl implements ModelTraining {

    private training: boolean;

    constructor() {
        this.training = false;
    }

    isTraining(): boolean {
        return this.training;
    }

    setIsTraining(training: boolean): void {
        this.training = training;
    }
}