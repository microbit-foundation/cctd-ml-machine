import type { PollingPredictorEngine } from "../application/PollingPredictorEngine";

export class EngineController {
    constructor(
        private pollingPredictorEngine: PollingPredictorEngine,
    ) { }

    public startPollingPredictorEngine() {
        this.pollingPredictorEngine.start();
    }

    public stopPollingPredictorEngine() {
        this.pollingPredictorEngine.stop();
    }
}