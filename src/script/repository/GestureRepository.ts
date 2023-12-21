/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { PersistantGestureData } from '../domain/Gestures';
import Gesture from '../domain/Gesture';
import {
  Readable,
  Subscriber,
  Unsubscriber,
  Writable,
  derived,
  get,
  writable,
} from 'svelte/store';
import ClassifierRepository from './ClassifierRepository';
import PersistantWritable from './PersistantWritable';

class GestureRepository implements Readable<Gesture[]> {
  private readonly LOCAL_STORAGE_KEY = 'gestureData';
  private static gestureStore: Writable<Gesture[]>; // TODO: Remake as persistant writable
  constructor(private modelRepository: ClassifierRepository) {
    GestureRepository.gestureStore = this.buildStore();
  }

  public getGesture(gestureId: number) {
    const gestures = get(GestureRepository.gestureStore);
    const gestureIndex = gestures.findIndex(gesture => gesture.getId() === gestureId);
    if (gestureIndex === -1) {
      throw new Error(`Could not find gesture with id '${gestureId}'`);
    }
    return gestures[gestureIndex];
  }

  public subscribe(
    run: Subscriber<Gesture[]>,
    invalidate?: ((value?: Gesture[] | undefined) => void) | undefined,
  ): Unsubscriber {
    return GestureRepository.gestureStore.subscribe(run, invalidate);
  }

  public clearGestures(): void {
    GestureRepository.gestureStore.set([]);
  }

  public addGesture(gestureData: PersistantGestureData): Gesture {
    const gesture = this.buildGesture(gestureData);
    GestureRepository.gestureStore.update(arr => {
      arr.push(gesture);
      return arr;
    });
    return gesture;
  }

  public removeGesture(gestureId: number) {
    GestureRepository.gestureStore.update(arr => {
      return arr.filter(gesture => gesture.getId() !== gestureId);
    });
  }

  private buildPersistedGestureStore(
    gestureData: PersistantGestureData,
  ): Writable<PersistantGestureData> {
    const store = writable(gestureData);

    return {
      subscribe: store.subscribe,
      set: val => {
        store.set(val);
        GestureRepository.gestureStore.update(val => val);
      },
      update: updater => {
        store.update(updater);
        GestureRepository.gestureStore.update(val => val);
      },
    };
  }

  private getPersistantValues(gesture: Gesture): PersistantGestureData {
    return {
      ID: gesture.getId(),
      name: gesture.getName(),
      recordings: gesture.getRecordings(),
      output: gesture.getOutput(),
    };
  }

  private buildGesture(persistedData: PersistantGestureData): Gesture {
    const store = this.buildPersistedGestureStore(persistedData);
    return new Gesture(store, this.modelRepository.getGestureConfidence(get(store).ID));
  }

  private buildStore(): Writable<Gesture[]> {
    // Derive a 'Gesture' type store from 'PersistantGestureData' persistant store.
    const persisted = new PersistantWritable(
      [] as PersistantGestureData[],
      this.LOCAL_STORAGE_KEY,
    ); // TODO: Replace '[]' to specify default value
    const derivedStore = derived([persisted], stores => {
      const persistedData = stores[0];
      return persistedData.map(persistedGestureData =>
        this.buildGesture(persistedGestureData),
      );
    });

    // Create a Gesture store, that updates persistant values when updated
    return {
      subscribe: derivedStore.subscribe,
      set: (newGestureArray: Gesture[]) =>
        persisted.set(
          newGestureArray.map(newGesture => this.getPersistantValues(newGesture)),
        ),
      update: updater => {
        const updated = updater(get(derivedStore)).map(updatedGesture =>
          this.getPersistantValues(updatedGesture),
        );
        persisted.set(updated);
      },
    };
  }
}

export default GestureRepository;
