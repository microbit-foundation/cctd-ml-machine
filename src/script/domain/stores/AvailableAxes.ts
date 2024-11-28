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

/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
class AvailableAxes implements Readable<Axis[]> {
  private value: Writable<Axis[]>;

  constructor(liveData: Readable<LiveData<LiveDataVector> | undefined>) {
    this.value = writable([]);
    this.value = writable([]);
    liveData.subscribe(data => {
      const unsubscriber = this.listenToLiveData(data);
      return () => {
        unsubscriber();
      };
    });
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
