/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  writable,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type { GestureID } from '../../../core/entities/Gesture';

export interface RecorderStore {
  isRecording: boolean;
  recordingGesture?: GestureID;
}

export class Recorder implements Readable<RecorderStore> {
  private store: Writable<RecorderStore>;

  constructor() {
    this.store = writable({
      isRecording: false,
    });
  }

  public subscribe(
    run: Subscriber<RecorderStore>,
    invalidate?: Invalidator<RecorderStore> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}
