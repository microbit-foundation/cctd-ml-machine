/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { GestureListListener } from '../domain/eventlistener/GestureListListener';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { AbstractStates } from '../statemanagement/AbstractStates';

/**
 * GestureStateHandler
 * Concrete listener that updates `AbstractStates` when gestures change.
 */
export class GestureStateHandler implements GestureListListener {
  private states?: AbstractStates;

  setStates(states: AbstractStates) {
    this.states = states;
  }

  onGesturesChanged(gestures: NewGesture[]): void {
    if (this.states) {
      this.states.setGestures(gestures);
    }
  }
}
