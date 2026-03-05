/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable, type Readable, type Writable } from 'svelte/store';
import type { GestureService } from '../domain/GestureService';
import type {
  AbstractReadonlyState,
  Unsubscriber,
} from '../statemanagement/AbstractReadonlyState';
import type { NewGesture } from '../../core/entities/NewGesture';

export class GesturesStateAdapter
  implements AbstractReadonlyState<NewGesture[]>, Readable<NewGesture[]>
{
  private gestures: Writable<NewGesture[]>;

  public constructor(gestureService: GestureService) {
    this.gestures = writable(gestureService.getGestures());
  }

  public get(): NewGesture[] {
    return get(this.gestures);
  }

  public set(gestures: NewGesture[]) {
    this.gestures.set(gestures);
  }

  public update(updater: (currentValue: NewGesture[]) => NewGesture[]): void {
    return this.gestures.update(updater);
  }

  public subscribe(
    run: (value: NewGesture[]) => void,
    invalidate?: ((value?: NewGesture[] | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.gestures.subscribe(run, invalidate);
  }
}
