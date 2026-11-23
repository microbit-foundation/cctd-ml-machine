/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
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
import type { ValidationSet } from '../../../core/entities/ValidationSet';
import type { RecordingData } from '../../../core/entities/RecordingData';
import PersistantWritable from '../../repository/PersistantWritable';
import type Gestures from './gesture/Gestures';
import type { GestureID } from '../../../core/entities/Gesture';

/**
 * File format for downloaded/uploaded validation sets.
 * Mirrors the shape of the training dataset (ID, name, recordings), so
 * a training dataset file can also be imported as validation sets.
 */
export type PersistedValidationSet = {
  ID: GestureID;
  name: string;
  recordings: RecordingData[];
};

export type ValidationSetImportResult = {
  importedSets: number;
  skippedSets: string[];
};

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

  /**
   * Returns the validation sets alongside gesture names, in gesture order, for downloading.
   */
  public exportSets(): PersistedValidationSet[] {
    const sets = get(this);
    return get(this.gestures).map((gesture, idx) => ({
      ID: gesture.ID,
      name: gesture.name,
      recordings: sets[idx]?.recordings ?? [],
    }));
  }

  /**
   * Replaces the current validation sets with the imported ones.
   * Each imported set is matched to an existing gesture by ID, falling back to the
   * gesture name (case-insensitive). Sets matching no gesture are skipped.
   */
  public importFrom(data: PersistedValidationSet[]): ValidationSetImportResult {
    if (!Array.isArray(data)) {
      throw new Error('Invalid validation set file: expected an array');
    }
    const gestures = get(this.gestures);
    const merged = new Map<GestureID, RecordingData[]>();
    const skippedSets: string[] = [];

    data.forEach(entry => {
      if (!entry || !Array.isArray(entry.recordings)) {
        return;
      }
      const gesture =
        gestures.find(g => g.ID === entry.ID) ??
        gestures.find(
          g =>
            typeof entry.name === 'string' &&
            g.name.trim().toLowerCase() === entry.name.trim().toLowerCase(),
        );
      if (!gesture) {
        skippedSets.push(entry.name ?? String(entry.ID));
        return;
      }
      merged.set(gesture.ID, [...(merged.get(gesture.ID) ?? []), ...entry.recordings]);
    });

    // Reassign recording IDs, to avoid collisions between imported recordings
    let nextId = Date.now();
    const newSets: ValidationSet[] = gestures
      .filter(gesture => merged.has(gesture.ID))
      .map(gesture => ({
        gestureId: gesture.ID,
        recordings: merged.get(gesture.ID)!.map(recording => ({
          ...recording,
          ID: nextId++,
        })),
      }));

    this.validationSets.set(newSets);
    return { importedSets: newSets.length, skippedSets };
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
