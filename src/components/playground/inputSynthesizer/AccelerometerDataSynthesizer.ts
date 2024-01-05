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
import { liveAccelerometerData } from '../../../script/stores/Stores';
import LiveData from '../../../script/domain/LiveData';
import { MicrobitAccelerometerData } from '../../../script/livedata/MicrobitAccelerometerData';

type AccelerometerSynthesizerData = {
  intervalSpeed: number;
  xSpeed: number;
  ySpeed: number;
  zSpeed: number;
  isActive: boolean;
};

class AccelerometerSynthesizer implements Readable<AccelerometerSynthesizerData> {
  private interval: NodeJS.Timeout | undefined = undefined;
  private store: Writable<AccelerometerSynthesizerData>;

  constructor(private liveData: LiveData<MicrobitAccelerometerData>) {
    this.store = writable({
      intervalSpeed: this.getInitialIntervalValue(),
      xSpeed: this.getInitialSineSpeed(),
      ySpeed: this.getInitialSineSpeed() + 1 / 1000,
      zSpeed: this.getInitialSineSpeed() + 2 / 1000,
      isActive: false,
    });
  }

  public subscribe(
    run: Subscriber<AccelerometerSynthesizerData>,
    invalidate?: ((value?: AccelerometerSynthesizerData | undefined) => void) | undefined,
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
    this.liveData.put({
      x: Math.sin(val * get(this.store).xSpeed),
      y: Math.sin(val * get(this.store).ySpeed),
      z: Math.sin(val * get(this.store).zSpeed),
    });
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

const accelerometerSynthesizer = new AccelerometerSynthesizer(liveAccelerometerData);

export default accelerometerSynthesizer;
