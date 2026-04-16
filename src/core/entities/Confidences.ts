import type { GestureID } from "./NewGesture";

export class Confidences {
    private confidences: Map<GestureID, number>;
    constructor(confidences: Map<GestureID, number>) {
        this.confidences = confidences;
    }

    getConfidences(): Map<GestureID, number> {
        return this.confidences;
    }

    getConfidence(gestureID: GestureID): number | undefined {
        return this.confidences.get(gestureID);
    }

    setConfidence(gestureID: GestureID, confidence: number): void {
        this.confidences.set(gestureID, confidence);
    }
}