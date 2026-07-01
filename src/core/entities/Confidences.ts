import ConsoleLogger from '../logging/ConsoleLogger';
import type { GestureID, NewGesture } from './NewGesture';

export class Confidences {
  private log = new ConsoleLogger(Confidences.name);

  private confidences: Map<GestureID, number>;
  constructor(confidences: Map<GestureID, number>) {
    this.confidences = confidences;
  }

  getConfidences(): Map<GestureID, number> {
    return this.confidences;
  }

  getConfidence(gesture: NewGesture): number | undefined {
    return this.confidences.get(gesture.getID());
  }

  setConfidence(gestureID: GestureID, confidence: number): void {
    this.confidences.set(gestureID, confidence);
  }

  isConfident(gesture: NewGesture): boolean {
    const confidence = this.getConfidence(gesture);
    if (confidence === undefined) {
      this.log.warn(`No confidence value found for gesture ${gesture.getID()}`);
      return false;
    }
    return confidence >= gesture.getOutput().requiredConfidence;
  }

  getMostConfidentGestureID(): GestureID | undefined {
    let mostConfidentGestureID: GestureID | undefined = undefined;
    let highestConfidence = -Infinity;
    for (const [gestureID, confidence] of this.confidences.entries()) {
      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        mostConfidentGestureID = gestureID;
      }
    }
    return mostConfidentGestureID;
  }
}
