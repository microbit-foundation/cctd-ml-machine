/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { derived } from 'svelte/store';
import type { Gesture, GestureID } from '../../core/entities/Gesture';
import type { RecordingData } from '../../core/entities/RecordingData';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { GestureService } from '../domain/GestureService';
import { SvelteStateAdapterReadonly } from '../statemanagement/SvelteStateAdapterReadonly';
import type { GesturesStateAdapter } from '../interface-adapter/GesturesStateAdapter';
import type { AbstractReadonlyState } from '../statemanagement/AbstractReadonlyState';
import type { Logger } from '../../core/logging/Logger';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import { GestureImpl } from '../domain/implementation/gesture/GestureImpl';
import type { PersistedGestureData } from '../../lib/domain/stores/gesture/Gestures';
import type { MBSpecs } from 'microbyte';
import type { GestureOutput } from '../../core/entities/GestureOutput';
import type { NewGesture } from '../../core/entities/NewGesture';

export class GestureController {
  setRequiredConfidence(gestureId: GestureID, requiredConfidence: number) {
    const gesture = this.gestureService.getGesture(gestureId);
    if (!gesture) {
      throw new Error('Invalid gesture id, not found, id: ' + gestureId);
    }
    gesture.getConfidence().requiredConfidence = requiredConfidence;
    this.gestureService.saveGesture(gesture);
    this.updateState();
  }
  setGestureOuput(gestureId: GestureID, ouput: GestureOutput) {
    const gesture = this.gestureService.getGesture(gestureId);
    if (!gesture) {
      throw new Error('Invalid gesture id, not found, id: ' + gestureId);
    }
    gesture.setOutput(ouput);
    this.gestureService.saveGesture(gesture);
    this.updateState();
  }
  private log: Logger;
  public constructor(
    private gesturesState: GesturesStateAdapter,
    private gestureService: GestureService,
  ) {
    this.log = new ConsoleLogger('GestureController');
  }

  public createGesture(name: string): NewGesture {
    const newGesture = this.gestureService.createGesture(name);
    this.updateState();
    return newGesture;
  }

  public setGestureName(gesture: GestureID, name: string) {
    this.gestureService.setGestureName(gesture, name);
    this.updateState();
  }

  public getGestures(): AbstractReadonlyState<NewGesture[]> {
    return this.gesturesState;
  }

  public getGesture(id: GestureID): NewGesture | undefined {
    return this.gestureService.getGesture(id);
  }

  public getGestureState(id: GestureID): AbstractState<NewGesture> {
    const derivation = derived(this.gesturesState, gests => {
      const idx = gests.findIndex(gest => gest.getID() === id);
      if (idx === -1) {
        this.log.warn(`Gesture with id ${id} does not exist`);
        return new GestureImpl(-1, 'deleted', [], {}, '#000000');
      }

      return gests[idx];
    });

    return new SvelteStateAdapterReadonly(derivation);
  }

  public clearGestures() {
    this.gestureService.setGestures([]);
    this.updateState();
  }

  public deleteGesture(gesture: GestureID): void {
    this.log.log(`Deleting gesture with id ${gesture}`);
    this.gestureService.deleteGesture(gesture);
    this.updateState();
  }

  public addRecording(gesture: GestureID, recording: RecordingData): void {
    this.gestureService.addRecording(gesture, recording);
    this.updateState();
  }

  public deleteRecording(gestureId: GestureID, recordingId: number) {
    this.gestureService.deleteRecording(gestureId, recordingId);
    this.updateState();
  }

  public importFromJson(importable: string) {
    const persisted = JSON.parse(importable) as PersistedGestureData[];
    this.gestureService.setGestures(
      persisted.map(
        persist =>
          new GestureImpl(
            persist.ID,
            persist.name,
            persist.recordings,
            persist.output,
            persist.color,
          ),
      ),
    );
    this.updateState();
  }

  private updateState() {
    const updatedState = this.gestureService.getGestures();
    this.gesturesState.set(updatedState);
  }
}
