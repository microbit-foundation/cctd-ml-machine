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
import { MicrobitAccelerometerDataVector } from '../../../script/livedata/MicrobitAccelerometerData';
import LiveData from '../../../script/domain/stores/LiveData';
import { LiveDataVector } from '../../../script/domain/stores/LiveDataVector';
import { stores } from '../../../script/stores/Stores';
import { Synthetic5AxisData, SyntheticLiveData } from './SyntheticLiveData ';
import BaseVector from '../../../script/livedata/BaseVector';

type LiveDataSynthesizerOptions = {
  intervalSpeed: number;
  xSpeed: number;
  ySpeed: number;
  zSpeed: number;
  isActive: boolean;
};

class LiveDataSynthesizer implements Readable<LiveDataSynthesizerOptions> {
  private interval: NodeJS.Timeout | undefined = undefined;
  private store: Writable<LiveDataSynthesizerOptions>;

  constructor(private referenceStore: SyntheticLiveData) {
    this.store = writable({
      intervalSpeed: this.getInitialIntervalValue(),
      xSpeed: this.getInitialSineSpeed(),
      ySpeed: this.getInitialSineSpeed() + 1 / 1000,
      zSpeed: this.getInitialSineSpeed() + 2 / 1000,
      isActive: false,
    });
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
    return this.getMinSineSpeed();
  }

  public getMinSineSpeed() {
    return 0;
  }

  public getMaxSineSpeed() {
    return 100;
  }

  public generateData() {
    const val = new Date().getTime();
    const newValue = new BaseVector([
      Math.sin(val * get(this.store).xSpeed),
      Math.sin(val * get(this.store).ySpeed),
      Math.sin(val * get(this.store).zSpeed),
      Math.sin(val * get(this.store).zSpeed) * Math.sin(val * get(this.store).xSpeed),
      Math.sin(val * get(this.store).ySpeed) * Math.sin(val * get(this.store).xSpeed),
    ],
      ["A", "B", "C", "D", "E"])
    this.referenceStore.put(new Synthetic5AxisData(newValue));
  }

  public setXSpeed(value: number) {
    this.store.update(updater => {
      updater.xSpeed = value / 1000;
      return updater;
    });
  }

  public setYSpeed(value: number) {
    this.store.update(updater => {
      updater.ySpeed = value / 1000;
      return updater;
    });
  }

  public setZSpeed(value: number) {
    this.store.update(updater => {
      updater.zSpeed = value / 1000;
      return updater;
    });
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

const liveData = stores.setLiveData(new SyntheticLiveData())
const liveDataSynthesizer = new LiveDataSynthesizer(liveData);


export default liveDataSynthesizer;
