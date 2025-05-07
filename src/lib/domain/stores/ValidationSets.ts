/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  derived,
  get,
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
import type Gestures from './gesture/Gestures';

class ValidationSets implements Readable<ValidationSet[]> {
  private validationSets: Writable<ValidationSet[]>;

  public constructor(private gestures: Gestures) {
    this.validationSets = new PersistantWritable([], 'validation_set');
    gestures.subscribe(gestureStore => {
      this.validationSets.update(sets => {
        return sets.filter(
          set => gestureStore.findIndex(gest => gest.ID === set.gestureId) !== -1,
        );
      });
    });
  }

  public addRecording(gestureId: GestureID, recording: RecordingData) {
    this.validationSets.update(sets => {
      if (sets.findIndex(e => e.gestureId === gestureId) === -1) {
        sets.push({
          gestureId: gestureId,
          recordings: [],
        });
      }

      const result = sets.map(set => {
        if (gestureId === set.gestureId) {
          return {
            gestureId,
            recordings: [...set.recordings, recording],
          } as ValidationSet;
        }
        return set;
      });
      return result;
    });
    this.sortSetsAccordingToGestures();
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

  public count(): number {
    return get(this.validationSets).reduce((pre, cur) => pre + cur.recordings.length, 0);
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
    return get(this);
  }

  public clear(): void {
    this.validationSets.set([]);
  }

  public subscribe(
    run: Subscriber<ValidationSet[]>,
    invalidate?: Invalidator<ValidationSet[]> | undefined,
  ): Unsubscriber {
    return derived([this.validationSets, this.gestures], stores => {
      const [sets, gestures] = stores;
      return gestures.map(gesture => {
        const recordingsIndex = sets.findIndex(set => set.gestureId === gesture.ID);
        const resultSet: ValidationSet = {
          gestureId: gesture.ID,
          recordings: recordingsIndex !== -1 ? sets[recordingsIndex].recordings : [],
        };
        return resultSet;
      });
    }).subscribe(run, invalidate);
  }

  private sortSetsAccordingToGestures() {
    const idOrder = Object.fromEntries(
      get(this.gestures).map((gesture, idx) => [gesture.ID, idx]),
    );
    this.validationSets.update(result => {
      result.sort((a, b) => idOrder[a.gestureId] - idOrder[b.gestureId]);
      return result;
    });
  }
}

export default ValidationSets;
