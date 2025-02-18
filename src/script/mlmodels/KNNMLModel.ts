/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type MLModel } from '../domain/MLModel';
import Logger from '../utils/Logger';
import type { LabelledPoint } from './KNNNonNormalizedMLModel';
import { distanceBetween } from '../utils/graphUtils';
import type { Vector } from '../domain/Vector';

class KNNMLModel implements MLModel {
  constructor(
    private k: number,
    private noOfClasses: number,
    private points: LabelledPoint[],
    private dataMean: Vector,
    private stdDeviation: Vector,
  ) {
    Logger.log('KNNMLModel', 'New (normalized) KNN model was initialized');
  }

  public async predict(filteredData: Vector): Promise<number[]> {
    // Sort points by distance to live-data point
    const orderedPoints = [...this.points];
    orderedPoints.sort((a, b) => {
      const aDist = distanceBetween(filteredData, a.vector);
      const bDist = distanceBetween(filteredData, b.vector);
      return aDist - bDist;
    });

    // Find the nearest gesture class indices
    const neighbours = [];
    for (let i = 0; i < this.k; i++) {
      const neighbour = orderedPoints[i];
      neighbours.push(neighbour.classIndex);
    }

    // Compute the confidences and create the confidences array.
    const confidences = [];
    for (let i = 0; i < this.noOfClasses; i++) {
      confidences.push(neighbours.filter(e => e === i).length / this.k);
    }

    return Promise.resolve(confidences);
  }

  public static normalizePoint(point: Vector, mean: Vector, stdDeviation: Vector) {
    return point.subtract(mean).divide(stdDeviation);
  }
}

export default KNNMLModel;
