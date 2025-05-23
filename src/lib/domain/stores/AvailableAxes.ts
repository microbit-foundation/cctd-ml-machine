import type { Axis } from '../Axis';
import {
  type Writable,
  type Readable,
  writable,
  type Subscriber,
  type Unsubscriber,
  get,
} from 'svelte/store';
import type { LiveData } from './LiveData';
import type { LiveDataVector } from './LiveDataVector';
import type Gestures from './gesture/Gestures';
import Logger from '../../utils/Logger';

/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
class AvailableAxes implements Readable<Axis[]> {
  private value: Writable<Axis[]>;

  constructor(
    liveData: Readable<LiveData<LiveDataVector> | undefined>,
    private gestures: Gestures,
  ) {
    this.value = writable(this.getAxesFromGestures(gestures));
    liveData.subscribe(data => {
      const unsubscriber = this.listenToLiveData(data);
      return () => {
        unsubscriber();
      };
    });
  }

  private getAxesFromGestures(gestures: Gestures) {
    if (gestures.getGestures().length > 0) {
      const recordings = gestures.getGestures()[0].getRecordings();
      if (recordings.length > 0) {
        Logger.log(
          'Available Axes',
          'Found default available axes in recordings',
          recordings[0].labels,
        );
        return recordings[0].labels.map(
          (label: string, index: number) =>
            ({
              index,
              label,
            }) as Axis,
        );
      }
    }
    return [];
  }

  public loadFromGestures() {
    this.value.set(this.getAxesFromGestures(this.gestures));
  }

  public subscribe(
    run: Subscriber<Axis[]>,
    invalidate?: (value?: Axis[]) => void,
  ): Unsubscriber {
    return this.value.subscribe(run, invalidate);
  }

  private listenToLiveData(liveData?: LiveData<LiveDataVector>): Unsubscriber {
    if (!liveData) {
      return () => {};
    }
    return liveData.subscribe(e => {
      const axes = e.getLabels().map((label, index) => ({
        index,
        label,
      }));
      if (axes.length !== get(this.value).length) {
        this.value.set(axes);
        Logger.log(
          'AvailableAxes',
          'New available axes',
          axes.map(e => e.label).join(', '),
        );
      }
      if (!!get(this.value).find((e, i) => axes[i].label !== e.label)) {
        this.value.set(axes);
        Logger.log(
          'AvailableAxes',
          'New available axes',
          axes.map(e => e.label).join(', '),
        );
      }
    });
  }
}

export default AvailableAxes;
