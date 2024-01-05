/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { tensor } from '@tensorflow/tfjs';
import MLModel from '../domain/MLModel';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

class KNNMLModel implements MLModel {
  constructor(
    private model: knnClassifier.KNNClassifier,
    private k: number,
  ) {}
  public async predict(filteredData: number[]): Promise<number[]> {
    const inputTensor = tensor([filteredData]);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const prediction = await this.model.predictClass(inputTensor, this.k);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const classes = Object.getOwnPropertyNames(prediction.confidences);
      const confidences: number[] = [];

      for (let i = 0; i < classes.length; i++) {
        const clazz = classes[i];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
