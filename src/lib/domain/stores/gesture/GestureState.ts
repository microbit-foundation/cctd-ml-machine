/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  derived,
  get,
} from 'svelte/store';
import GestureConfidence from './GestureConfidence';
import { PinTurnOnState } from '../../../../core/entities/PinTurnOnState';
import BindableValue from '../BindableValue';
import { MBSpecs } from 'microbyte';
import type { PersistedGestureData } from './Gestures';
import type { RecordingData } from '../../../../core/entities/RecordingData';
import type { Confidence } from '../../../../core/entities/Confidence';
import type { GestureOutput, SoundData } from '../../../../core/entities/GestureOutput';
import type { GestureID } from '../../../../core/entities/Gesture';

export type GestureData = PersistedGestureData & { confidence: Confidence };

class GestureState implements Readable<GestureData> {
  private store: Readable<GestureData>;

  constructor(
    private persistedData: Writable<PersistedGestureData>,
    private gestureConfidence: GestureConfidence,
    private onRecordingsChanged: () => void,
  ) {
    this.store = this.deriveStore();
  }

  public subscribe(
    run: Subscriber<GestureData>,
    invalidate?: ((value?: GestureData | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public getId(): GestureID {
    return get(this.store).ID;
  }

  public getRecordings(): RecordingData[] {
    return get(this.store)?.recordings ?? [];
  }

  public getOutput(): GestureOutput {
    return get(this.store).output;
  }

  public setName(newName: string): void {
    this.persistedData.update(val => {
      val.name = newName;
      return val;
    });
  }

  public getName(): string {
    return get(this.store).name;
  }

  /**
   * Get the HEX color assigned to this gesture.
   */
  public getColor(): string {
    return get(this.store).color;
  }

  /**
   * Set the HEX color assigned to this gesture.
   */
  public setColor(color: string): void {
    this.persistedData.update(val => {
      val.color = color;
      return val;
    });
  }

  public addRecording(recording: RecordingData) {
    this.onRecordingsChanged();
    this.persistedData.update(newVal => {
      newVal.recordings = [recording, ...newVal.recordings];
      return newVal;
    });
  }

  public removeRecording(recordingId: number) {
    this.onRecordingsChanged();
    this.persistedData.update(newVal => {
      newVal.recordings = newVal.recordings.filter(
        recording => recording.ID !== recordingId,
      );
      return newVal;
    });
  }

  public setSoundOutput(sound: SoundData | undefined) {
    this.persistedData.update(newVal => {
      newVal.output.sound = sound;
      return newVal;
    });
  }

  public setIOPinOutput(pin: MBSpecs.UsableIOPin, state: PinTurnOnState, time: number) {
    this.persistedData.update(newVal => {
      newVal.output.outputPin = {
        pin: pin,
        pinState: state,
        turnOnTime: time,
      };
      return newVal;
    });
  }

  public setLEDOutput(matrix: boolean[]) {
    this.persistedData.update(newVal => {
      newVal.output.matrix = matrix;
      return newVal;
    });
  }

  public bindName(): BindableValue<string> {
    const setter = (val: string) => this.setName(val);
    const bindable = new BindableValue(
      setter,
      derived(this.store, s => s.name),
    );
    return bindable;
  }

  public getConfidence(): GestureConfidence {
    return this.gestureConfidence;
  }

  private deriveStore(): Readable<GestureData> {
    return derived([this.persistedData, this.gestureConfidence], stores => {
      const persistantData = stores[0];
      const confidenceData = stores[1];
      const derivedData: GestureData = {
        ID: persistantData.ID,
        name: persistantData.name,
        recordings: persistantData.recordings,
        output: persistantData.output,
        color: persistantData.color,
        confidence: confidenceData,
      };

      return derivedData;
    });
  }
}

export default GestureState;
