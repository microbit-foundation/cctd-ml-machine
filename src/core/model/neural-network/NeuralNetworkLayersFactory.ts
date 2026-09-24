/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import * as tf from '@tensorflow/tfjs';
import type { NeuralNetworkArchitecture } from './NeuralNetworkArchitecture';
import {
  ActivationFunction,
  type NeuralNetworkLayerSettings,
} from './NeuralNetworkLayerSettings';

export class NeuralNetworkLayersModelFactory {
  public buildLayers(architecture: NeuralNetworkArchitecture): tf.LayersModel {
    const inputLayerSettings = architecture.getInputLayer();
    const hiddenLayersSettings = architecture.getHiddenLayers();
    const outputLayerSettings = architecture.getOutputLayer();

    const tfInput = tf.input({ shape: [inputLayerSettings.getNumberOfNodes()] });
    const tfInputLayer = this.getInputLayer(inputLayerSettings, tfInput);
    const hiddenLayers = this.getHiddenLayers(hiddenLayersSettings, tfInputLayer);
    const outputLayer = this.getOutputLayer(
      outputLayerSettings,
      hiddenLayers[hiddenLayers.length - 1],
    ) as tf.SymbolicTensor;
    return tf.model({ inputs: tfInput, outputs: outputLayer });
  }

  private getInputLayer(
    inputLayerSettings: NeuralNetworkLayerSettings,
    inputTensor: tf.SymbolicTensor,
  ) {
    const tfNormalizer = tf.layers.batchNormalization().apply(inputTensor);
    return tf.layers
      .dense({
        units: inputLayerSettings.getNumberOfNodes(),
        activation: this.getTfActivation(inputLayerSettings.getActivationFunction()),
      })
      .apply(tfNormalizer);
  }

  private getHiddenLayers(
    hiddenLayersSettings: NeuralNetworkLayerSettings[],
    inputLayer: tf.Tensor | tf.Tensor[] | tf.SymbolicTensor | tf.SymbolicTensor[],
  ) {
    let previousLayer = inputLayer;
    return hiddenLayersSettings.map(settings => {
      const layer = tf.layers
        .dense({
          units: settings.getNumberOfNodes(),
          activation: this.getTfActivation(settings.getActivationFunction()),
        })
        .apply(previousLayer);
      previousLayer = layer;
      return layer;
    });
  }

  private getOutputLayer(
    outputLayerSettings: NeuralNetworkLayerSettings,
    lastHiddenLayer: tf.Tensor | tf.Tensor[] | tf.SymbolicTensor | tf.SymbolicTensor[],
  ) {
    return tf.layers
      .dense({
        units: outputLayerSettings.getNumberOfNodes(),
        activation: this.getTfActivation(outputLayerSettings.getActivationFunction()),
      })
      .apply(lastHiddenLayer);
  }

  private getTfActivation(activationType: ActivationFunction) {
    switch (activationType) {
      case ActivationFunction.RELU:
        return 'relu';
      case ActivationFunction.SOFTMAX:
        return 'softmax';
    }
  }
}
