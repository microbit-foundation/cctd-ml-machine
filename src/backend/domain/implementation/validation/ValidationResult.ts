/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type AccuracyMatrix from '../../../../core/classifier/AccuracyMatrix';
import type { EvaluationResult } from '../../../../core/classifier/EvaluationResult';

// TODO: Maybe it should just be evaluation result that's used, since this just mirrors all of the methods
export class ValidationResult {
  public constructor(private evaluationResult: EvaluationResult) {}

  public getAccuracy(): number {
    return this.evaluationResult.getAccuracy();
  }

  public getMatrix(): AccuracyMatrix {
    return this.evaluationResult.getAccuracyMatrix();
  }

  public getPredictions(): number[] {
    return this.evaluationResult.getPredictionIndices();
  }

  public getConfusionBuckets(): number[][] {
    return this.evaluationResult.getConfusionBuckets();
  }
}
