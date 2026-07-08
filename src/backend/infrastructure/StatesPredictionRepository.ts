/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { PredictionOutput } from '../../core/classifier/PredictionOutput';
import type { PredictionRepository } from '../domain/PredictionRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesPredictionRepository implements PredictionRepository {
  constructor(private states: AbstractStates) {}

  savePrediction(predictionOutput: PredictionOutput): void {
    this.states.getPredictionState().set(predictionOutput);
  }
}
