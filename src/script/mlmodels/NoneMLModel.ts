/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import MLModel from '../domain/MLModel';

class NoneMLModel implements MLModel {
  predict(filteredData: number[]): Promise<number[]> {
    throw new Error('No model have been assigned. Make a new model!');
  }
}

export default NoneMLModel;
