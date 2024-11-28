import {
  get,
  writable,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type { Axis } from '../Axis';
import type { LiveData } from './LiveData';
import type { LiveDataVector } from './LiveDataVector';
import Logger from '../../utils/Logger';
import type Gestures from './gesture/Gestures';

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
class AvailableAxes implements Readable<Axis[]> {
  private value: Writable<Axis[]>;

  constructor(liveData: Readable<LiveData<LiveDataVector> | undefined>, gestures: Gestures) {
    this.value = writable(this.getInitalAxes(gestures))
    liveData.subscribe(data => {
      const unsubscriber = this.listenToLiveData(data);
      return () => {
        unsubscriber();
      };
    });
  }


  private getInitalAxes(gestures: Gestures) {
    /*if (gestures.getGestures().length > 0) {
      const recordings = gestures.getGestures()[0].getRecordings();
      if (recordings.length > 0) {
        Logger.log("Available Axes", "Found default available axes in recordings", recordings[0].labels)
        return recordings[0].labels.map((label, index) => ({
          index,
          label
        } as Axis))
      }
    }*/
    return [];
  }
  public subscribe(
    run: Subscriber<Axis[]>,
    invalidate?: (value?: Axis[]) => void,
  ): Unsubscriber {
    return this.value.subscribe(run, invalidate);
  }

  private listenToLiveData(liveData?: LiveData<LiveDataVector>): Unsubscriber {
    if (!liveData) {
      return () => { };
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
