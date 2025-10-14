/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkArchitecture } from "./NeuralNetworkArchitecture";
import type { NeuralNetworkModelBaseSettings } from "./NeuralNetworkModelBaseSettings";
import type { NeuralNetworkModelSettings } from "./NeuralNetworkModelSettings";
import type { NeuralNetworkTrainingObserver } from "./NeuralNetworkTrainingObserver";


export class NeuralNetworkSettingsImpl implements NeuralNetworkModelSettings {

    public constructor(private baseSettings: NeuralNetworkModelBaseSettings) {
    }

    getArchitecture(): NeuralNetworkArchitecture {
        throw new Error("Method not implemented.");
    }
    getTrainingObserver(): NeuralNetworkTrainingObserver {
        throw new Error("Method not implemented.");
    }
    getLearningRate(): number {
        throw new Error("Method not implemented.");
    }
    getNumberOfEpochs(): number {
        throw new Error("Method not implemented.");
    }
    getBatchSize(): number {
        throw new Error("Method not implemented.");
    }
    getValidationSplit(): number {
        throw new Error("Method not implemented.");
    }
}
