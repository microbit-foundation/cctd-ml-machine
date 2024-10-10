/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ControlledStorage from '../ControlledStorage';
import { Subscriber, Unsubscriber, Writable, get, writable } from 'svelte/store';
import LocalStorageClassifierRepository from './LocalStorageClassifierRepository';
import GestureRepository from '../domain/GestureRepository';
import Gesture from '../domain/stores/gesture/Gesture';
import { PersistantGestureData } from '../domain/stores/gesture/Gestures';
import { stores } from '../stores/Stores';

class LocalStorageGestureRepository implements GestureRepository {
  private readonly LOCAL_STORAGE_KEY = 'gestureData';
  private static gestureStore: Writable<Gesture[]>;
  constructor(private classifierRepository: LocalStorageClassifierRepository) {
    LocalStorageGestureRepository.gestureStore = writable([]);
    LocalStorageGestureRepository.gestureStore.set(this.getPersistedGestures());
  }

  public getGesture(gestureId: number): Gesture {
    const gestures = get(LocalStorageGestureRepository.gestureStore);
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
    return LocalStorageGestureRepository.gestureStore.subscribe(run, invalidate);
  }

  public clearGestures(): void {
    LocalStorageGestureRepository.gestureStore.set([]);
    this.saveCurrentGestures();
  }

  public addGesture(gestureData: PersistantGestureData): Gesture {
    const gesture = this.buildGesture(gestureData);
    LocalStorageGestureRepository.gestureStore.update(arr => {
      arr.push(gesture);
      return arr;
    });
    this.saveCurrentGestures();
    return gesture;
  }

  public removeGesture(gestureId: number) {
    LocalStorageGestureRepository.gestureStore.update(arr => {
      return arr.filter(gesture => gesture.getId() !== gestureId);
    });
    this.saveCurrentGestures();
  }

  private buildPersistedGestureStore(
    gestureData: PersistantGestureData,
  ): Writable<PersistantGestureData> {
    const store = writable(gestureData);

    return {
      subscribe: store.subscribe,
      set: val => {
        store.set(val);
        LocalStorageGestureRepository.gestureStore.update(val => val);
        this.saveCurrentGestures();
      },
      update: updater => {
        store.update(updater);
        LocalStorageGestureRepository.gestureStore.update(val => val);
        this.saveCurrentGestures();
      },
    };
  }

  private saveCurrentGestures() {
    const gestures = get(LocalStorageGestureRepository.gestureStore);
    const data = gestures.map(gesture => this.getPersistantValues(gesture));
    ControlledStorage.set<PersistantGestureData[]>(this.LOCAL_STORAGE_KEY, data);
  }

  private getPersistantValues(gesture: Gesture): PersistantGestureData {
    return {
      ID: gesture.getId(),
      name: gesture.getName(),
      recordings: gesture.getRecordings(),
      color: gesture.getColor(),
      output: gesture.getOutput(),
    };
  }

  private getPersistedGestures(): Gesture[] {
    const resultFromFetch: PersistantGestureData[] = this.getPersistedData();
    return resultFromFetch.map((persistedData, index) => {
      const gesture = this.buildGesture(persistedData);
      return gesture;
    });
  }

  private buildGesture(persistedData: PersistantGestureData) {
    const store = this.buildPersistedGestureStore(persistedData);
    // TODO: The classifier object should be accessed through the repository, not the store. This cannot be done until the classifier is cached.
    const onRecordingsChanged = () => stores.getClassifier().getModel().markAsUntrained();

    if (!this.classifierRepository.hasGestureConfidence(get(store).ID)) {
      this.classifierRepository.setGestureConfidence(get(store).ID, 0);
    }
    const confidence = this.classifierRepository.getGestureConfidence(get(store).ID);

    return new Gesture(store, confidence, onRecordingsChanged);
  }

  private getPersistedData(): PersistantGestureData[] {
    if (!ControlledStorage.hasValid(this.LOCAL_STORAGE_KEY)) {
      return [];
    }
    const storedData = ControlledStorage.get<PersistantGestureData[]>(
      this.LOCAL_STORAGE_KEY,
    );
    return storedData;
  }
}

export default LocalStorageGestureRepository;
