/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  Readable,
  Subscriber,
  Unsubscriber,
  Writable,
  get,
  writable,
} from 'svelte/store';
import { stores } from '../../../script/stores/Stores';
import { SyntheticLiveData } from './SyntheticLiveData ';
import BaseVector from '../../../script/livedata/BaseVector';

type LiveDataSynthesizerOptions = {
  intervalSpeed: number;
  speeds: number[]
  isActive: boolean;
  noOfAxes: number
};
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "M", "N", "O", "P"]

class LiveDataSynthesizer implements Readable<LiveDataSynthesizerOptions> {
  private interval: NodeJS.Timeout | undefined = undefined;
  private store: Writable<LiveDataSynthesizerOptions>;
  private referenceStoreGetter: () => SyntheticLiveData;

  constructor() {
    this.store = writable({
      intervalSpeed: this.getInitialIntervalValue(),
      speeds: [this.getInitialSineSpeed()],
      isActive: false,
      noOfAxes: 1
    } as LiveDataSynthesizerOptions);
    stores.setLiveData(new SyntheticLiveData([letters[0]]))
    this.referenceStoreGetter = () => get(stores).liveData as SyntheticLiveData
  }

  public subscribe(
    run: Subscriber<LiveDataSynthesizerOptions>,
    invalidate?: ((value?: LiveDataSynthesizerOptions | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public updateInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.generateData();
    }, get(this.store).intervalSpeed);
  }

  public getMinIntervalValue() {
    return 5;
  }

  public getMaxIntervalValue() {
    return 300;
  }

  public getInitialIntervalValue() {
    return this.getMinIntervalValue();
  }

  public getInitialSineSpeed() {
    return this.getMinSineSpeed() / 3000;
  }

  public getMinSineSpeed() {
    return 0.0;
  }

  public getMaxSineSpeed() {
    return 100;
  }

  public setNoOfAxes(axes: number) {
    this.store.update(e => {
      if (e.noOfAxes !== axes) {
        console.log("changed liveDatra")
        stores.setLiveData(new SyntheticLiveData(letters.slice(0, axes)))
      }
      e.noOfAxes = axes;
      if (axes > e.speeds.length) {
        e.speeds = [...e.speeds, ...new Array(axes - e.speeds.length).fill(0)]
      } else {
        e.speeds = e.speeds.slice(0, axes);
      }
      return e;
    })
  }

  public generateData() {
    const val = new Date().getTime();

    let newVector = new Array(get(this.store).noOfAxes).fill(0);
    newVector = newVector.map((x, i) => Math.sin(val * get(this.store).speeds[i]))
    const vectorLetters = letters.slice(0, newVector.length)
    const newValue = new BaseVector(newVector, vectorLetters)

    this.referenceStoreGetter().put(newValue);
  }

  public setSpeed(index: number, speed: number) {
    this.store.update(s => {
      s.speeds[index] = speed / 3000;
      return s
    })
  }

  public setIntervalSpeed(value: number) {
    this.store.update(updater => {
      updater.intervalSpeed = value;
      return updater;
    });
    this.updateInterval();
  }

  public stop(): void {
    clearInterval(this.interval);
    this.store.update(updater => {
      updater.isActive = false;
      return updater;
    });
  }

  public start(): void {
    this.updateInterval();
    this.store.update(updater => {
      updater.isActive = true;
      return updater;
    });
  }

  public isActive(): boolean {
    return get(this).isActive;
  }
}

const liveDataSynthesizer = new LiveDataSynthesizer();


export default liveDataSynthesizer;
