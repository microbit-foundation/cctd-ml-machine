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

    public constructor(
        private baseSettings: NeuralNetworkModelBaseSettings,
        private networkArchitecture: NeuralNetworkArchitecture,
        private networkObserver: NeuralNetworkTrainingObserver
    ) {
    }

    public getArchitecture(): NeuralNetworkArchitecture {
        return this.networkArchitecture;
    }
    public getTrainingObserver(): NeuralNetworkTrainingObserver {
        return this.networkObserver;
    }
    public getLearningRate(): number {
        return this.baseSettings.getLearningRate();
    }
    public getNumberOfEpochs(): number {
        return this.baseSettings.getNumberOfEpochs();
    }
    public getBatchSize(): number {
        return this.baseSettings.getBatchSize();
    }
    public getValidationSplit(): number {
        return this.baseSettings.getValidationSplit();
    }
}
