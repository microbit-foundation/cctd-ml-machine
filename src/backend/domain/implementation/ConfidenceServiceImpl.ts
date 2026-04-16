import type { PredictionOutput } from "../../../core/classifier/PredictionOutput";
import { Confidences } from "../../../core/entities/Confidences";
import type { GestureID } from "../../../core/entities/NewGesture";
import type { ConfidenceRepository } from "../ConfidenceRepository";
import type { ConfidenceService } from "../ConfidenceService";
import type { GestureRepository } from "../GestureRepository";

export class ConfidenceServiceImpl implements ConfidenceService {

    constructor(private confidenceRepository: ConfidenceRepository, private gestureRepository: GestureRepository) {
    }

    setConfidences(confidences: Confidences): void {
        this.confidenceRepository.setConfidences(confidences);
    }
}