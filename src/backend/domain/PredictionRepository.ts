import type { PredictionOutput } from "../../core/classifier/PredictionOutput";

export interface PredictionRepository {
    savePrediction(predictionOutput: PredictionOutput): void;
}