/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { knnCurrentPoint, knnNeighbours } from '../../lib/stores/KNNStores';
import { distanceBetween } from '../../lib/utils/graphUtils';
import Logger from '../../lib/utils/Logger';
import BaseVector from '../vector/BaseVector';
import type { Vector } from '../vector/Vector';
import type { MLModel } from './MLModel';

export type LabelledPoint = {
  classIndex: number;
  vector: Vector;
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
    Logger.log('KNNNonNormalizedMLModel', 'New KNN model was initialized');
  }

  public async predict(filteredData: Vector): Promise<Vector> {
    knnCurrentPoint.set(filteredData);

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
      neighbours.push(neighbour);
    }

    knnNeighbours.set(neighbours);
    // Compute the confidences and create the confidences array.
    const confidences = [];
    for (let i = 0; i < this.noOfClasses; i++) {
      confidences.push(
        neighbours.map(e => e.classIndex).filter(e => e === i).length / this.k,
      );
    }

    return new BaseVector(confidences);
  }
}

export default KNNNonNormalizedMLModel;
