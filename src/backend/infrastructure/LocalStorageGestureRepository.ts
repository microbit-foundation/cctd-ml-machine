/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Gesture, GestureID } from '../../core/entities/Gesture';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Logger } from '../../core/logging/Logger';
import ControlledStorage from '../../lib/ControlledStorage';
import type { GestureRepository } from '../domain/GestureRepository';
import { GestureSerializer } from '../../core/serialization/gesture/GestureSerializer';
import type { SerializedGesture } from '../../core/serialization/gesture/SerializedGesture';
import { s } from 'vite/dist/node/types.d-aGj9QkWt';

export class LocalStorageGestureRepository implements GestureRepository {
  private readonly LOCAL_STORAGE_KEY = 'gestureData';
  private serializer;

  public constructor(
    private log: Logger,
    private subscription: (gestures: NewGesture[]) => void,
  ) {
    this.serializer = new GestureSerializer();
  }

  // TODO: This could be swapped for UUID. The reason for this is to allow the core application to create gestures
  public generateGestureId(): GestureID {
    let proposed = new Date().getTime();
    while (this.getGestures().find(gest => gest.getID() === proposed)) {
      proposed++;
    }
    return proposed;
  }

  public saveGesture(gesture: NewGesture): NewGesture {
    const gestures = this.getGestures();
    const gestIdx = gestures.findIndex(gest => gest.getID() === gesture.getID());
    if (gestIdx === -1) {
      this.saveGestures([...gestures, gesture]);
    } else {
      const updated = [...gestures];
      updated[gestIdx] = gesture;
      this.saveGestures(updated);
    }
    return gesture;
  }

  public getGestures(): NewGesture[] {
    const persisted = this.getPersistedData();
    return persisted.map(gest => this.serializer.deserialize(gest));
  }

  public getGesture(gestureId: GestureID): NewGesture | undefined {
    const gestures = this.getGestures();
    const filtered = gestures.filter(gest => gest.getID() === gestureId);
    if (!filtered.length) {
      this.log.warn(`Couldn't find any gestures with gesture id ${gestureId}`);
      return undefined;
    }
    if (filtered.length > 1) {
      throw new Error(`There's multiple gestures with the id ${gestureId}`);
    }
    return filtered[0];
  }

  public saveGestures(value: NewGesture[]): NewGesture[] {
    const serialized = value.map(gest => this.serializer.serialize(gest));
    ControlledStorage.set(this.LOCAL_STORAGE_KEY, serialized);
    this.subscription?.(value);
    return value;
  }

  public clearGestures(): void {
    ControlledStorage.set(this.LOCAL_STORAGE_KEY, []);
    this.subscription?.([]);
  }

  public removeGesture(gestureId: number): void {
    this.saveGestures([...this.getGestures().filter(gest => gest.getID() !== gestureId)]);
  }

  private getPersistedData(): SerializedGesture[] {
    if (!ControlledStorage.hasValid(this.LOCAL_STORAGE_KEY)) {
      return [];
    }
    const storedData = ControlledStorage.get<SerializedGesture[]>(this.LOCAL_STORAGE_KEY);
    return storedData;
  }
}
