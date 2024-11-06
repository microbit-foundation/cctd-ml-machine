/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { TrainingData } from "./ModelTrainer";

interface TrainingDataRepository {
    getTrainingData(): TrainingData;
}

export default TrainingDataRepository;