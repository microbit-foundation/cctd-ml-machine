/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  get,
  writable,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type { ValidationSet } from '../ValidationSet';
import type { GestureID } from './gesture/Gesture';
import type { RecordingData, RecordingSample } from '../RecordingData';

class ValidationSets implements Readable<ValidationSet[]> {
  private validationSets: Writable<ValidationSet[]>;

  public constructor() {
    this.validationSets = writable([]);
  }

  public addRecording(
    gestureId: GestureID,
    samples: RecordingSample[],
    labels: string[],
  ) {
    this.validationSets.update(sets => {
      return sets.map(set => {
        if (gestureId === set.gestureId) {
          const recording: RecordingData = {
            ID: Date.now(),
            labels,
            samples,
          };
          return {
            gestureId,
            recordings: [...set.recordings, recording],
          } as ValidationSet;
        }
        return set;
      });
    });
  }

  public getValidationSets(): ValidationSet[] {
    return get(this.validationSets);
  }

  public subscribe(
    run: Subscriber<ValidationSet[]>,
    invalidate?: Invalidator<ValidationSet[]> | undefined,
  ): Unsubscriber {
    return this.validationSets.subscribe(run, invalidate);
  }
}

export default ValidationSets;
