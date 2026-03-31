/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { derived } from 'svelte/store';
import type { GestureID } from '../../core/entities/Gesture';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { GestureService } from '../domain/GestureService';
import { SvelteStateAdapterReadonly } from '../statemanagement/SvelteStateAdapterReadonly';
import type { GesturesStateAdapter } from '../interface-adapter/GesturesStateAdapter';
import type { AbstractReadonlyState } from '../statemanagement/AbstractReadonlyState';
import type { Logger } from '../../core/logging/Logger';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import { GestureImpl } from '../domain/implementation/gesture/GestureImpl';
import type { GestureOutput } from '../../core/entities/GestureOutput';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { SerializedGesture } from '../../core/serialization/gesture/SerializedGesture';
import { GestureSerializer } from '../../core/serialization/gesture/GestureSerializer';
import type { Recording } from '../../core/entities/recording/Recording';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class GestureController {
  clearValidationRecordings() {
    const gestures = this.gestureService.getGestures();
    gestures.forEach(gesture => {
      gesture.setValidationRecordings([]);
    });
    this.gestureService.saveGestures(gestures);
  }
  public getValidationRecordings(): AbstractReadonlyState<Recording[]> {
    const derivation = derived(this.states.getGestures(), gests => {
      gests.map(gest => gest.getValidationRecordings()).flat();
      const recordings = gests.map(gest => gest.getValidationRecordings()).flat();
      return recordings;
    });
    return new SvelteStateAdapterReadonly(derivation);
  }
  public getGestureFromRecording(recordingId: number): NewGesture | undefined {
    return this.gestureService.getGestureFromRecording(recordingId);
  }
  private log: Logger;
  public constructor(
    private states: AbstractStates,
    private gestureService: GestureService,
  ) {
    this.log = new ConsoleLogger('GestureController');
  }

  getDownloadableGesturesAsJson(): string {
    const gestures = this.gestureService.getGestures();
    const serializer = new GestureSerializer();
    const serializedData: SerializedGesture[] = gestures.map(gesture =>
      serializer.serialize(gesture),
    );
    return JSON.stringify(serializedData, null, 2);
  }

  deleteValidationRecording(gestureId: GestureID, recordingId: number): void {
    this.gestureService.deleteValidationRecording(gestureId, recordingId);
  }

  setRequiredConfidence(gestureId: GestureID, requiredConfidence: number) {
    const gesture = this.gestureService.getGesture(gestureId);
    if (!gesture) {
      throw new Error('Invalid gesture id, not found, id: ' + gestureId);
    }
    gesture.getConfidence().requiredConfidence = requiredConfidence;
    this.gestureService.saveGesture(gesture);
  }
  setGestureOuput(gestureId: GestureID, ouput: GestureOutput) {
    const gesture = this.gestureService.getGesture(gestureId);
    if (!gesture) {
      throw new Error('Invalid gesture id, not found, id: ' + gestureId);
    }
    gesture.setOutput(ouput);
    this.gestureService.saveGesture(gesture);
  }

  public createGesture(name: string): NewGesture {
    return this.gestureService.createGesture(name);
  }

  public setGestureName(gesture: GestureID, name: string) {
    this.gestureService.setGestureName(gesture, name);
  }

  public getGestures(): AbstractReadonlyState<NewGesture[]> {
    return this.states.getGestures();
  }

  public getGesture(id: GestureID): NewGesture | undefined {
    return this.gestureService.getGesture(id);
  }

  public getGestureState(id: GestureID): AbstractState<NewGesture> {
    const derivation = derived(this.states.getGestures(), gests => {
      const idx = gests.findIndex(gest => gest.getID() === id);
      if (idx === -1) {
        this.log.warn(`Gesture with id ${id} does not exist`);
        return new GestureImpl(-1, 'deleted', [], [], {}, '#000000');
      }

      return gests[idx];
    });

    return new SvelteStateAdapterReadonly(derivation);
  }

  public clearGestures() {
    this.gestureService.setGestures([]);
  }

  public deleteGesture(gesture: GestureID): void {
    this.log.log(`Deleting gesture with id ${gesture}`);
    this.gestureService.deleteGesture(gesture);
  }

  public addRecording(gesture: GestureID, recording: Recording): void {
    this.gestureService.addRecording(gesture, recording);
  }

  public deleteRecording(gestureId: GestureID, recordingId: number) {
    this.gestureService.deleteRecording(gestureId, recordingId);
  }

  public importFromJson(importable: string) {
    const serializer = new GestureSerializer();
    const parsed: SerializedGesture[] = JSON.parse(importable);
    const deserialized = parsed.map(ser => serializer.deserialize(ser));
    this.gestureService.setGestures(deserialized);
  }
}
