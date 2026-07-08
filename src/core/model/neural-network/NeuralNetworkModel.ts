/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import type { MLModel } from '../MLModel';
import type { Vector } from '../../vector/Vector';
import BaseVector from '../../vector/BaseVector';
import { ModelType } from '../ModelType';

export class NeuralNetworkModel implements MLModel {
  constructor(private neuralNet: LayersModel) {}

  getType(): ModelType {
    return ModelType.NERUAL_NETWORK;
  }

  public async predict(filteredData: Vector): Promise<Vector> {
    const inputTensor = tf.tensor([filteredData.getValue()]);
    const prediction: tf.Tensor = this.neuralNet.predict(inputTensor) as tf.Tensor;
    try {
      const predictionOutput = (await prediction.data()) as Float32Array;
      return new BaseVector(Array.from(predictionOutput));
    } catch (err) {
      console.error('Prediction error:', err);
      return Promise.reject(err);
    }
  }
}
