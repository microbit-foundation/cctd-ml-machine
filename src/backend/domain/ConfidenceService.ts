import type { Confidences } from '../../core/entities/Confidences';

export interface ConfidenceService {
  setConfidences(prediction: Confidences): void;
}
