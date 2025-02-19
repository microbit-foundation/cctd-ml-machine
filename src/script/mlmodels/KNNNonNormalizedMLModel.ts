/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { knnGraphPointsStore } from '../../components/graphs/knngraph/KnnModelGraph';
import type { MLModel } from '../domain/MLModel';
import Vector from '../domain/Vector';
import { stores } from '../stores/Stores';
import { distanceBetween } from '../utils/graphUtils';
import Logger from '../utils/Logger';

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

  public predict(filteredData: number[]): Promise<number[]> {
    const filteredDataVec = new Vector(filteredData);
    knnGraphPointsStore.update(s => {
      s.livePoint = filteredDataVec;
      return s;
    })

    // Sort points by distance to live-data point
    const orderedPoints = [...this.points];
    orderedPoints.sort((a, b) => {
      const aDist = distanceBetween(filteredData, a.vector.getValues());
      const bDist = distanceBetween(filteredData, b.vector.getValues());
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
