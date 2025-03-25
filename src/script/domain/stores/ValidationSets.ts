/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
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
import type { ValidationSet } from '../ValidationSet';
import type { GestureID } from './gesture/Gesture';
import type { RecordingData } from '../RecordingData';
import PersistantWritable from '../../repository/PersistantWritable';

class ValidationSets implements Readable<ValidationSet[]> {
  private validationSets: Writable<ValidationSet[]>;

  public constructor() {
    this.validationSets = new PersistantWritable([], 'validation_set');
  }

  public addRecording(gestureId: GestureID, recording: RecordingData) {
    this.validationSets.update(sets => {
      if (sets.findIndex(e => e.gestureId === gestureId) === -1) {
        sets.push({
          gestureId: gestureId,
          recordings: [],
        });
      }
      return sets.map(set => {
        if (gestureId === set.gestureId) {
          return {
            gestureId,
            recordings: [...set.recordings, recording],
          } as ValidationSet;
        }
        return set;
      });
    });
  }

  public getForGesture(gestureId: GestureID): Readable<ValidationSet> {
    return derived(this.validationSets, sets => {
      const idx = sets.findIndex(e => e.gestureId === gestureId);
      if (idx === -1) {
        return {
          gestureId: gestureId,
          recordings: [],
        };
      }
      return sets[idx];
    });
  }

  public removeValidationRecording(recordingId: number): void {
    this.validationSets.update(sets => {
      return sets.map(set => ({
        ...set,
        recordings: set.recordings.filter(recording => recording.ID !== recordingId),
      }));
    });
  }

  public getValidationSets(): ValidationSet[] {
    return get(this.validationSets);
  }

  public clear(): void {
    this.validationSets.set([]);
  }

  public subscribe(
    run: Subscriber<ValidationSet[]>,
    invalidate?: Invalidator<ValidationSet[]> | undefined,
  ): Unsubscriber {
    return this.validationSets.subscribe(run, invalidate);
  }
}

export default ValidationSets;
