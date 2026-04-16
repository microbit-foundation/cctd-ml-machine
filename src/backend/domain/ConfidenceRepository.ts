import type { Confidences } from "../../core/entities/Confidences";

export interface ConfidenceRepository {
  setConfidences(confidence: Confidences): void;
  getConfidences(): Confidences;
}