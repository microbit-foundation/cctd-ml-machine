/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  derived,
  get,
  writable,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type ValidationSets from './ValidationSets';
import type Classifier from './Classifier';
import BaseVector from '../BaseVector';
import { ClassifierInput } from '../ClassifierInput';
import { findLargestIndex } from '../../utils/Math';
import type Gestures from './gesture/Gestures';
import type Gesture from './gesture/Gesture';
import type { GestureID } from './gesture/Gesture';
import type HighlightedAxes from './HighlightedAxes';

export type ValidationResult = {
  prediction: number[];
  gestureIdx: number;
  recordingId: number;
}[][];
class ValidationResults implements Readable<ValidationResult> {
  private store: Writable<ValidationResult>;
  private accuracy: Writable<number>;

  public constructor(
    private validationSets: ValidationSets,
    private classifier: Classifier,
    private gestures: Gestures,
    private highlightedAxes: HighlightedAxes
  ) {
    this.store = writable([]);
    this.accuracy = writable(0);
  }

  public subscribe(
    run: Subscriber<ValidationResult>,
    invalidate?: Invalidator<ValidationResult> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public async evaluateValidationSet() {
    const filters = this.classifier.getFilters();
    const setEvaluations = get(this.validationSets).map(async set => {
      const recordingEvaluations = set.recordings.map(async rec => {
        const samples = rec.samples.map(sample => new BaseVector(sample.vector));
        const classifierInput = ClassifierInput.getInputForAxes(samples, get(this.highlightedAxes));
        const inputVector = new BaseVector(classifierInput.getInput(filters));
        const prediction = await this.classifier
          .getModel()
          .predict(inputVector);
        return {
          recordingId: rec.ID,
          prediction,
        };
      });

      const predictions = await Promise.all(recordingEvaluations);

      return predictions.map(pred => ({
        gestureIdx: findLargestIndex(pred.prediction),
        prediction: pred.prediction,
        recordingId: pred.recordingId,
      }));
    });
    const evaluations = await Promise.all(setEvaluations);
    this.store.set(evaluations);
  }

  public getForGesture(
    gestureId: GestureID,
  ): Readable<{ prediction: number[]; gestureIdx: number; recordingId: number }[]> {
    const index = this.gestures
      .getGestures()
      .findIndex(gesture => gesture.getId() === gestureId);
    return derived([this.store], stores => {
      const [resultStore] = stores;
      return resultStore[index];
    });
  }

  public getAccuracy(): Readable<number> {
    return this.accuracy;
  }

  public setAccuracy(acc: number): void {
    this.accuracy.set(acc);
  }

  public getEvaluatedGesture(recordingId: number): Gesture | undefined {
    const x = get(this.store)
      .find(pred => pred.findIndex(rec => rec.recordingId === recordingId) !== -1)
      ?.find(e => e.recordingId === recordingId);
    if (!x) {
      return undefined;
    }
    return this.gestures.getGestures()[x.gestureIdx];
  }
}

export default ValidationResults;
