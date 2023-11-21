import { LayersModel } from '@tensorflow/tfjs';
import MLModel from '../domain/MLModel';
import * as tf from '@tensorflow/tfjs';

class LayersMLModel implements MLModel {
  constructor(private neuralNet: LayersModel) {}
  predict(filteredData: number[]): number[] {
    const inputTensor = tf.tensor([filteredData]);
    const prediction: tf.Tensor = this.neuralNet.predict(inputTensor) as tf.Tensor;
    prediction
      .data()
      .then(data => {
        console.log('Prediction', data as Float32Array);
      })
      .catch(err => console.error('Prediction error:', err));
    return [];
  }
}

export default LayersMLModel;
