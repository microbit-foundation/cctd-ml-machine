/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Classifier from "../../script/domain/Classifier";
import ClassifierRepository from "../../script/domain/ClassifierRepository";
import GestureConfidence from "../../script/domain/GestureConfidence";

class TestClassifierRepository implements ClassifierRepository {

    getClassifier(): Classifier {
        throw new Error("Method not implemented.");
    }
    
    getGestureConfidence(gestureId: number): GestureConfidence {
        throw new Error("Method not implemented.");
    }

}

export default TestClassifierRepository;