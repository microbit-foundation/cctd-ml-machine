/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { knnCurrentPoint, knnNeighbours } from '../../../lib/stores/KNNStores';
import { distanceBetween } from '../../../lib/utils/graphUtils';
import Logger from '../../../lib/utils/Logger';
import BaseVector from '../../vector/BaseVector';
import type { Vector } from '../../vector/Vector';
import type { LabelledPoint } from '../KNNNonNormalizedMLModel';
import type { MLModel } from '../MLModel';
import type { KNNModelSettings } from './KNNModelSettings';

class KNNMLModel implements MLModel {
  constructor(
    private settings: KNNModelSettings,
    private points: LabelledPoint[],
    private mean: Vector,
    private stdDeviation: Vector
  ) {
    Logger.log('KNNMLModel', 'New (normalized) KNN model was initialized');
  }

  public async predict(filteredData: Vector): Promise<Vector> {
    const inputPoint: Vector = this.getInputPoint(filteredData);
    knnCurrentPoint.set(inputPoint);

    // Sort points by distance to live-data point
    const orderedPoints = [...this.points];
    orderedPoints.sort((a, b) => {
      const aDist = distanceBetween(inputPoint, a.vector);
      const bDist = distanceBetween(inputPoint, b.vector);
      return aDist - bDist;
    });

    // Find the nearest gesture class indices
    const neighbours = [];
    for (let i = 0; i < this.settings.k; i++) {
      const neighbour = orderedPoints[i];
      neighbours.push(neighbour);
    }

    knnNeighbours.set(neighbours);

    // Compute the confidences and create the confidences array.
    const confidences = [];
    for (let i = 0; i < this.settings.numberOfClasses; i++) {
      confidences.push(
        neighbours.map(e => e.classIndex).filter(e => e === i).length / this.settings.k,
      );
    }

    return Promise.resolve(new BaseVector(confidences));
  }

  private getInputPoint(filteredData: Vector): Vector {
    if (this.settings.normalize) {
      return this.normalizePoint(filteredData);
    }
    return filteredData;
  }

  /**
   * @deprecated
   */
  public static normalizePoint(point: Vector, mean: Vector, stdDeviation: Vector) {
    return point.subtract(mean).divide(stdDeviation);
  }

  public normalizePoint(point: Vector) {
    return point.subtract(this.mean).divide(this.stdDeviation);
  }
}

export default KNNMLModel;
