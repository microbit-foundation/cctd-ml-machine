/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import ConsoleLogger from '../../logging/ConsoleLogger';
import { distanceBetween } from '../../utils/Math';
import BaseVector from '../../vector/BaseVector';
import type { Vector } from '../../vector/Vector';
import type { MLModel } from '../MLModel';
import type { KNNModelObserver } from './KNNModelObserver';
import type { KNNModelSettings } from './KNNModelSettings';
import type { LabelledPoint } from './LabelledPoint';

class KNNMLModel implements MLModel {
  constructor(
    private settings: KNNModelSettings,
    private points: LabelledPoint[],
    private mean: Vector,
    private stdDeviation: Vector,
    private observer: KNNModelObserver
  ) {
    ConsoleLogger.log('KNNMLModel', 'New (normalized) KNN model was initialized');
    ConsoleLogger.log('KNNMLModel', 'Settings:', JSON.stringify({
      k: settings.getK(),
      numberOfClasses: settings.getNumberOfClasses(),
      shouldNormalize: settings.shouldNormalize(),
    }));
    ConsoleLogger.log('KNNMLModel', 'Mean:', mean.getValue());
    ConsoleLogger.log('KNNMLModel', 'Standd Deviation:', stdDeviation.getValue());
  }

  public async predict(filteredData: Vector): Promise<Vector> {
    const inputPoint: Vector = this.getInputPoint(filteredData);
    if (this.observer) {
      this.observer.onInputComputed(inputPoint);
    }

    // Sort points by distance to live-data point
    const orderedPoints = [...this.points];
    orderedPoints.sort((a, b) => {
      const aDist = distanceBetween(inputPoint, a.vector);
      const bDist = distanceBetween(inputPoint, b.vector);
      return aDist - bDist;
    });

    // Find the nearest gesture class indices
    const neighbours = [];
    for (let i = 0; i < this.settings.getK(); i++) {
      const neighbour = orderedPoints[i];
      neighbours.push(neighbour);
    }

    if (this.observer) {
      this.observer.onNearestNeighboursFound(neighbours);
    }

    // Compute the confidences and create the confidences array.
    const confidences = [];
    for (let i = 0; i < this.settings.getNumberOfClasses(); i++) {
      const neighbourIndices = neighbours.map(e => e.classIndex);
      confidences.push(
        neighbourIndices.filter(e => e === i).length / this.settings.getK(),
      );
    }

    return Promise.resolve(new BaseVector(confidences));
  }

  private getInputPoint(filteredData: Vector): Vector {
    if (this.settings.shouldNormalize()) {
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
