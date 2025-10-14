/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkArchitecture } from "./NeuralNetworkArchitecture";
import { ActivationFunction, type NeuralNetworkLayerSettings } from "./NeuralNetworkLayerSettings";


export class BasicNeuralNetworkArchitecture implements NeuralNetworkArchitecture {

    public constructor(
        private noOfClasses: number,
        private noOfFilters: number,
        private noOfNodesInHiddenLayer: number
    ) { }

    public getInputLayer(): NeuralNetworkLayerSettings {
        return {
            getActivationFunction: () => ActivationFunction.RELU,
            getNoOfNodes: () => this.noOfClasses * this.noOfFilters
        }
    }
    public getHiddenLayers(): NeuralNetworkLayerSettings[] {
        return [{
            getActivationFunction: () => ActivationFunction.RELU,
            getNoOfNodes: () => this.noOfNodesInHiddenLayer
        }]
    }
    public getOutputLayer(): NeuralNetworkLayerSettings {
        return {
            getActivationFunction: () => ActivationFunction.SOFTMAX,
            getNoOfNodes: () => this.noOfClasses
        }
    }

}