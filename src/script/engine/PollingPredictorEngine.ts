import { Subscriber, Unsubscriber, Writable, writable } from "svelte/store";
import Classifier from "../domain/Classifier";
import Engine, { EngineData } from "../domain/Engine";
import GestureConfidence from "../domain/GestureConfidence";
import Gestures from "../domain/Gestures";

class PollingPredictorEngine implements Engine {
    private pollingInterval: ReturnType<typeof setInterval>;
    private pollingIntervalTime = 100;
    private isRunning: boolean;

    constructor(private classifier: Classifier) {
        this.isRunning = true;
        this.pollingInterval = setInterval(() => {
            this.predict();
        }, this.pollingIntervalTime)
    }
    public subscribe(run: Subscriber<EngineData>, invalidate?: ((value?: EngineData | undefined) => void) | undefined): Unsubscriber {
        throw new Error("Method not implemented.");
    }

    public start(): void {
        throw new Error("Method not implemented.");
    }

    public stop(): void {
        throw new Error("Method not implemented.");
    }

    private predict() {
        if (this.classifier.getModel().isTrained() && this.isRunning) {
            console.log("Classifiyy")
        }
    }
}

export default PollingPredictorEngine;