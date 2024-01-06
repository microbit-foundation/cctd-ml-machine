/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Classifier from './Classifier';
import GestureConfidence from './GestureConfidence';

interface ClassifierRepository {
  getClassifier(): Classifier;

  // TODO: I'm not entirely sure if this is appropriate
  getGestureConfidence(gestureId: number): GestureConfidence;
}

export default ClassifierRepository;
