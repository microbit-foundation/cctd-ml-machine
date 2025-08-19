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
import type { GestureData, GestureID } from './gesture/Gesture';
import type HighlightedAxes from './HighlightedAxes';
import type { ValidationSetMatrix } from '../../../pages/validation/ValidationPage';
import Matrix from '../Matrix';

export type ValidationResult = {
  prediction: number[];
  gestureIdx: number;
  recordingId: number;
}[][];
class ValidationResults implements Readable<ValidationResult> {
  private store: Writable<ValidationResult>;
  private accuracy: Readable<number>;
  private autoUpdate: Writable<boolean>;

  public constructor(
    private validationSets: ValidationSets,
    private classifier: Classifier,
    private gestures: Gestures,
    private highlightedAxes: HighlightedAxes,
  ) {
    this.store = writable([]);
    this.autoUpdate = writable(false);
    this.accuracy = derived(this.getMatrix(), matrix => {
      return matrix.accurateResults / this.validationSets.count();
    });
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
        const classifierInput = ClassifierInput.getInputForAxes(
          samples,
          get(this.highlightedAxes),
        );
        const inputVector = new BaseVector(classifierInput.getInput(filters));
        const prediction = await this.classifier.getModel().predict(inputVector);
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

  public getMatrix(): Readable<ValidationSetMatrix> {
    return derived([this as Readable<ValidationResult>, this.gestures], stores => {
      const [valRes, gests] = stores;
      const matrix = this.createValidationMatrixVisual(valRes, gests);
      return matrix;
    });
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

  public getAutoUpdate(): Writable<boolean> {
    return this.autoUpdate;
  }

  private createValidationMatrixVisual = (
    validationResult: ValidationResult,
    gestures: GestureData[],
  ): ValidationSetMatrix => {
    const matrixRaw = this.createValidationMatrix(validationResult, gestures);

    const accurateResults = gestures.reduce(
      (pre, _, idx) => pre + matrixRaw.getValues()[idx][idx],
      0,
    );
    return {
      matrix: matrixRaw,
      accurateResults: accurateResults,
    };
  };

  private createValidationMatrix = (
    validationResults: {
      prediction: number[];
      gestureIdx: number;
    }[][],
    gestures: GestureData[],
  ): Matrix<number> => {
    const matrix = gestures.map((_, row) => {
      const results = validationResults[row];
      if (!results) {
        return gestures.map(_ => 0);
      }
      return gestures.map((_, col) => {
        return results.reduce((pre, cur) => {
          return pre + (cur.gestureIdx === col ? 1 : 0);
        }, 0);
      });
    });
    return new Matrix(matrix);
  };
}

export default ValidationResults;
