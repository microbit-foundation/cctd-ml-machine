/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { PredictionInput } from "./Predictioninput";
import type { PredictionOutput } from "./PredictionOutput";
import type { Dataset } from "./Dataset";
import type { TrainingResult } from "./TrainingResult";
import type { EvaluationResult } from "./EvaluationResult";

export interface Classifier {
    train(trainingData: Dataset): Promise<TrainingResult>;
    predict(input: PredictionInput): Promise<PredictionOutput>;
    evaluate(testData: Dataset): Promise<EvaluationResult>;
}
