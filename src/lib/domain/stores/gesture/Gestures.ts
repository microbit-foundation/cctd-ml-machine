/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  derived,
  get,
  writable,
} from 'svelte/store';
import GestureState, { type GestureData } from './GestureState';
import StaticConfiguration from '../../../../StaticConfiguration';
import type { GestureRepository } from '../../GestureRepository';
import type { RecordingData } from '../../../../core/entities/RecordingData';
import ConsoleLogger from '../../../../core/logging/ConsoleLogger';
import type { GestureOutput } from '../../../../core/entities/GestureOutput';
import type { GestureID } from '../../../../core/entities/Gesture';

/**
 * @deprecated Legacy type. Use SerializedGesture instead. 
 */
export type PersistedGestureData = {
  name: string;
  ID: GestureID;
  recordings: RecordingData[];
  output: GestureOutput;
  color: string;
};

class Gestures implements Readable<GestureData[]> {
  private static subscribableGestures: Writable<GestureState[]>;
  private repository: GestureRepository;

  constructor(repository: GestureRepository) {
    this.repository = repository;
    Gestures.subscribableGestures = writable();
    this.repository.subscribe(storeArray => {
      Gestures.subscribableGestures.set(storeArray);
    });
  }

  public subscribe(
    run: Subscriber<GestureData[]>,
    invalidate?: ((value?: GestureData[] | undefined) => void) | undefined,
  ): Unsubscriber {
    return derived(Gestures.subscribableGestures, gestures =>
      gestures.map(gesture => this.gestureToGestureData(gesture)),
    ).subscribe(run, invalidate);
  }

  public clearGestures() {
    this.repository.clearGestures();
  }

  public hasSufficientData(): boolean {
    if (get(Gestures.subscribableGestures).length < StaticConfiguration.minNoOfGestures) {
      return false;
    }
    const recordingsCount = get(Gestures.subscribableGestures).map(
      gesture => gesture.getRecordings().length,
    );
    return !recordingsCount.some(
      noOfRecordings => noOfRecordings < StaticConfiguration.minNoOfRecordingsPerGesture,
    );
  }

  public getGesture(gestureID: number): GestureState {
    return this.repository.getGesture(gestureID);
  }

  // TODO: Change to getCurrent() or something else maybe
  public getGestures(): GestureState[] {
    return get(Gestures.subscribableGestures);
  }

  public createGesture(name = ''): GestureState {
    const newId = Date.now();
    const color =
      StaticConfiguration.gestureColors[
        this.getNumberOfGestures() % StaticConfiguration.gestureColors.length
      ];
    return this.addGestureFromPersistedData({
      ID: newId,
      recordings: [],
      output: {}, //TODO: ADD DEFAULT VALUES HERE
      name: name,
      color,
    });
  }

  public removeGesture(gestureId: number): void {
    this.repository.removeGesture(gestureId);
  }

  public importFrom(gestureData: PersistedGestureData[]) {
    this.clearGestures();
    gestureData.forEach(data => this.addGestureFromPersistedData(data));
  }

  public getNumberOfGestures(): number {
    return get(Gestures.subscribableGestures).length;
  }

  public getBestPrediction(): Readable<GestureState | undefined> {
    return derived(
      get(Gestures.subscribableGestures).map(gest => gest.getConfidence()),
      confidences => {
        if (confidences.length == 0) {
          return undefined;
        }
        const sorted = [...confidences].map((data, index) => {
          return {
            index: index,
            value: data,
          };
        });

        sorted.sort((confidence1, confidence2) => {
          return (
            confidence2.value.currentConfidence - confidence1.value.currentConfidence
          );
        });

        return get(Gestures.subscribableGestures)[sorted[0].index];
      },
    );
  }

  private addGestureFromPersistedData(gestureData: PersistedGestureData): GestureState {
    ConsoleLogger.log(
      'Gestures',
      `Adding gesture from persistedData ${gestureData.name} (id:${gestureData.ID})`,
    );
    return this.repository.addGesture(gestureData);
  }

  private gestureToGestureData(gesture: GestureState): GestureData {
    return {
      ID: gesture.getId(),
      name: gesture.getName(),
      recordings: gesture.getRecordings(),
      output: gesture.getOutput(),
      color: gesture.getColor(),
      confidence: {
        currentConfidence: gesture.getConfidence().getCurrentConfidence(),
        requiredConfidence: gesture.getConfidence().getRequiredConfidence(),
        isConfident: gesture.getConfidence().isConfident(),
      },
    };
  }
}

export default Gestures;
