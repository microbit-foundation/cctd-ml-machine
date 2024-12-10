/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MLModel } from '../domain/MLModel';
import { distanceBetween } from '../utils/graphUtils';
import Logger from '../utils/Logger';

export type LabelledPoint = {
  classIndex: number;
  vector: number[];
};

/**
 * Represents a KNN model, in which points are not normalized and retain their raw values
 */
class KNNNonNormalizedMLModel implements MLModel {
  constructor(
    private k: number,
    private noOfClasses: number,
    private points: LabelledPoint[],
  ) {
    Logger.log("KNNNonNormalizedMLModel", "New KNN model was initialized")
  }

  public predict(filteredData: number[]): Promise<number[]> {
    // Sort points by distance to live-data point
    const orderedPoints = [...this.points];
    orderedPoints.sort((a, b) => {
      const aDist = distanceBetween(filteredData, a.vector);
      const bDist = distanceBetween(filteredData, b.vector)
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
}

export default KNNNonNormalizedMLModel;
