/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MLModel } from '../../model/MLModel';
import type { Classifier } from '../Classifier';
import type { ClassifierFactory } from '../ClassifierFactory';
import { AccuracyClassifierEvaluator } from '../evaluator/AccuracyClassifierEvaluator';
import { VectorClassifier } from './VectorClassifier';

export class DefaultClassifierFactory implements ClassifierFactory {
  public createClassifier(model: MLModel): Classifier {
    return new VectorClassifier(model, new AccuracyClassifierEvaluator());
  }
}
