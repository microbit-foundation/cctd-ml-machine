/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { TrainingResult } from '../../classifier/TrainingResult';
import type { LabelledPoint } from './LabelledPoint';

export class KNNMLModelTrainingResult implements TrainingResult {
  constructor(private knnPoints: LabelledPoint[]) {}

  public labelledPoints(): LabelledPoint[] {
    return this.knnPoints;
  }
}
