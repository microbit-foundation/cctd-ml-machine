import type { Confidences } from '../../core/entities/Confidences';
import type { NewGesture } from '../../core/entities/NewGesture';

export interface ConfidenceService {
  setConfidences(prediction: Confidences): void;
  getMostConfidentPrediction(): NewGesture | undefined;
}
