/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ClassifierInput from '../domain/ClassifierInput';
import Filters from '../domain/Filters';

export type AccelerometerRecording = {
  x: number[];
  y: number[];
  z: number[];
};

class AccelerometerClassifierInput implements ClassifierInput {
  constructor(private input: AccelerometerRecording) {}

  getInput(filters: Filters): number[] {
    return [
      ...filters.compute(this.input.x),
      ...filters.compute(this.input.y),
      ...filters.compute(this.input.z),
    ];
  }
}

export default AccelerometerClassifierInput;
