/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { PollingPredictorEngine } from '../application/PollingPredictorEngine';

export class EngineController {
  constructor(private pollingPredictorEngine: PollingPredictorEngine) {}

  public startPollingPredictorEngine() {
    this.pollingPredictorEngine.start();
  }

  public stopPollingPredictorEngine() {
    this.pollingPredictorEngine.stop();
  }
}
