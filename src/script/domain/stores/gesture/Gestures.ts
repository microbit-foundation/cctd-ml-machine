/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  Readable,
  Subscriber,
  Unsubscriber,
  Writable,
  derived,
  get,
  writable,
} from 'svelte/store';
import Gesture, { Confidence, GestureData, GestureID, GestureOutput } from './Gesture';
import StaticConfiguration from '../../../../StaticConfiguration';
import GestureRepository from '../../GestureRepository';

export type PersistantGestureData = {
  name: string;
  ID: GestureID;
  recordings: RecordingData[];
  output: GestureOutput;
  color: string;
};

export type RecordingData = {
  ID: number;
  data: {
    x: number[];
    y: number[];
    z: number[];
  };
};

class Gestures implements Readable<GestureData[]> {
  private static subscribableGestures: Writable<Gesture[]>;
  private repository: GestureRepository;
  private confidenceStore: Readable<Map<number, Confidence>>;

  constructor(repository: GestureRepository) {
    this.repository = repository;
    Gestures.subscribableGestures = writable();
    this.repository.subscribe(storeArray => {
      Gestures.subscribableGestures.set(storeArray);
    });
    this.confidenceStore = derived([this, ...this.getGestures()], stores => {
      const confidenceMap: Map<number, Confidence> = new Map();

      const [_, ...gestureStores] = stores;
      gestureStores.forEach(store => {
        confidenceMap.set(store.ID, store.confidence);
      });
      return confidenceMap;
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

  public getGesture(gestureID: number): Gesture {
    return this.repository.getGesture(gestureID);
  }

  // TODO: Change to getCurrent() or something else maybe
  public getGestures(): Gesture[] {
    return get(Gestures.subscribableGestures);
  }

  public createGesture(name = ''): Gesture {
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

  public importFrom(gestureData: PersistantGestureData[]) {
    this.clearGestures();
    gestureData.forEach(data => this.addGestureFromPersistedData(data));
  }

  public getNumberOfGestures(): number {
    return get(Gestures.subscribableGestures).length;
  }

  public getBestPrediction(): Readable<Gesture | undefined> {
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
          return confidence2.value.confidence - confidence1.value.confidence;
        });

        return get(Gestures.subscribableGestures)[sorted[0].index];
      },
    );
  }

  public getConfidences(): Readable<Map<number, Confidence>> {
    return this.confidenceStore;
  }

  private addGestureFromPersistedData(gestureData: PersistantGestureData): Gesture {
    return this.repository.addGesture(gestureData);
  }

  private gestureToGestureData(gesture: Gesture): GestureData {
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
