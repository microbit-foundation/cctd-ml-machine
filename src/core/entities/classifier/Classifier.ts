/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { EvaluationResult } from "../../classifier/EvaluationResult";
import type { PredictionInput } from "../../classifier/Predictioninput";
import type { PredictionOutput } from "../../classifier/PredictionOutput";
import type { TrainingResult } from "../../classifier/TrainingResult";
import type { Dataset } from "../../dataset/Dataset";

export interface Classifier {
    train(trainingData: Dataset): Promise<TrainingResult>;
    predict(input: PredictionInput): Promise<PredictionOutput>;
    evaluate(testData: Dataset): Promise<EvaluationResult>;
}
