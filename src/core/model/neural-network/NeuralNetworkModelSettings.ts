/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkArchitecture } from "./NeuralNetworkArchitecture";

export interface NeuralNetworkModelSettings {
    getLearningRate(): number;
    getArchitecture(): NeuralNetworkArchitecture;
}

