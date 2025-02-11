/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { tensor } from '@tensorflow/tfjs';
import { type MLModel } from '../domain/MLModel';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import Logger from '../utils/Logger';

class KNNMLModel implements MLModel {
  constructor(
    private model: knnClassifier.KNNClassifier,
    private k: number,
  ) {
    Logger.log('KNNMLModel', 'New (normalized) KNN model was initialized');
  }
  public async predict(filteredData: number[]): Promise<number[]> {
    const inputTensor = tensor(filteredData);

    try {
      const prediction = await this.model.predictClass(inputTensor, this.k);
      const classes = Object.getOwnPropertyNames(prediction.confidences);
      const confidences: number[] = [];

      for (let i = 0; i < classes.length; i++) {
        const clazz = classes[i];
        const confidence = prediction.confidences[clazz];
        confidences.push(confidence as number);
      }

      return Promise.resolve(confidences);
    } catch (err) {
      console.error('Prediction error: ', err);
      return Promise.reject(err);
    }
  }
}

export default KNNMLModel;
