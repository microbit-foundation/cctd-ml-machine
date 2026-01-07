/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Gesture, GestureID } from '../../core/entities/Gesture';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Logger } from '../../core/logging/Logger';
import ControlledStorage from '../../lib/ControlledStorage';
import type { PersistedGestureData } from '../../lib/domain/stores/gesture/Gestures';
import type { GestureRepository } from '../domain/GestureRepository';
import { GestureImpl } from '../domain/implementation/gesture/GestureImpl';

export class LocalStorageGestureRepository implements GestureRepository {
  private readonly LOCAL_STORAGE_KEY = 'gestureData';

  public constructor(private log: Logger) {}

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
    return persisted.map(
      persist =>
        new GestureImpl(
          persist.ID,
          persist.name,
          persist.recordings,
          persist.output,
          persist.color,
        ),
    );
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
    const persistedData: PersistedGestureData[] = value.map(gest => ({
      ID: gest.getID(),
      color: gest.getColor(),
      name: gest.getName(),
      output: gest.getOutput(),
      recordings: gest.getRecordings(),
    }));
    ControlledStorage.set(this.LOCAL_STORAGE_KEY, persistedData);
    return value;
  }

  public clearGestures(): void {
    ControlledStorage.set(this.LOCAL_STORAGE_KEY, []);
  }

  public removeGesture(gestureId: number): void {
    this.saveGestures([...this.getGestures().filter(gest => gest.getID() !== gestureId)]);
  }

  private getPersistedData(): PersistedGestureData[] {
    if (!ControlledStorage.hasValid(this.LOCAL_STORAGE_KEY)) {
      return [];
    }
    const storedData = ControlledStorage.get<PersistedGestureData[]>(
      this.LOCAL_STORAGE_KEY,
    );
    return storedData;
  }
}
