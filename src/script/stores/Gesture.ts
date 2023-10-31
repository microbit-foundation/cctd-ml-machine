import {
  Readable,
  Subscriber,
  Unsubscriber,
  Writable,
  derived,
  get,
} from 'svelte/store';
import { GestureData, GestureOutput, RecordingData, SoundData } from './mlStore';
import { PersistantGestureData } from './Gestures';
import { PinTurnOnState } from '../../components/output/PinSelectorUtil';
import MBSpecs from '../microbit-interfacing/MBSpecs';
import BindableValue from './BindableValue';

class Gesture implements Readable<GestureData> {
  private store: Readable<GestureData>;

  constructor(
    private persistedData: Writable<PersistantGestureData>,
  ) {
  this.store = this.deriveStore();
  }

  public subscribe(
    run: Subscriber<GestureData>,
    invalidate?: ((value?: GestureData | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public getId(): number {
    return get(this.store).ID;
  }

  public getRecordings(): RecordingData[] {
    return get(this.store).recordings;
  }

  public getOutput(): GestureOutput {
    return get(this.store).output;
  }

  public setName(newName: string): void {
    this.persistedData.update(val => {
      val.name = newName
      return val;
    });
  }

  public getName(): string {
    return get(this.store).name;
  }

  public addRecording(recording: RecordingData) {
    this.persistedData.update(newVal => {
      newVal.recordings = [recording, ...newVal.recordings];
      return newVal;
    });
  }

  public removeRecording(recordingId: number) {
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
    const bindable = new BindableValue(setter, derived(this.store, s => s.name))
    return bindable;
  }

  private deriveStore() {
    return derived([this.persistedData], stores => {
      const result = Object.assign({}, stores[0]);
      Object.assign(result, {
        confidence: 0
      })
      return result;
    })
  }
}

export default Gesture;
