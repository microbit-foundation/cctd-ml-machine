/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  derived,
  get,
  writable,
} from 'svelte/store';
import { type Repositories } from '../domain/Repositories';
import Classifier from '../domain/stores/Classifier';
import Gestures from '../domain/stores/gesture/Gestures';
import LocalStorageRepositories from '../repository/LocalStorageRepositories';
import Confidences from '../domain/stores/Confidences';
import HighlightedAxes from '../domain/stores/HighlightedAxes';
import SelectedModel from '../domain/SelectedModel';
import type { LiveData } from '../domain/stores/LiveData';
import AvailableAxes from '../domain/stores/AvailableAxes';
import KNNModelSettings from '../domain/stores/KNNModelSettings';
import { Recorder } from '../domain/stores/Recorder';
import { knnHasTrained } from './KNNStores';
import Devices from '../domain/Devices';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import ConsoleLogger from '../../core/logging/ConsoleLogger';

type StoresType = {
  liveData: LiveData<LiveDataVector> | undefined;
};

/**
 * Stores is a container object, that allows for management of global stores.
 */
class Stores implements Readable<StoresType> {
  private liveData: Writable<LiveData<LiveDataVector> | undefined>;
  private classifier: Classifier;
  private gestures: Gestures;
  private highlightedAxis: HighlightedAxes;
  private selectedModel: SelectedModel;
  private availableAxes: AvailableAxes;
  private devices: Devices;

  public constructor() {
    this.devices = new Devices();
    this.liveData = writable(undefined);
    const repositories: Repositories = new LocalStorageRepositories();
    this.classifier = repositories.getClassifierRepository().getClassifier();
    this.gestures = new Gestures(repositories.getGestureRepository());
    this.selectedModel = new SelectedModel(this.classifier, knnHasTrained);
    this.highlightedAxis = new HighlightedAxes(this.classifier, this.selectedModel);
    this.availableAxes = new AvailableAxes(this.liveData, this.gestures);
    this.availableAxes.subscribe(newAxes => {
      this.highlightedAxis.set(newAxes);
    });
  }

  public subscribe(
    run: Subscriber<StoresType>,
    invalidate?: Invalidator<StoresType> | undefined,
  ): Unsubscriber {
    return derived([this.liveData], stores => {
      return {
        liveData: stores[0],
      };
    }).subscribe(run, invalidate);
  }

  public setLiveData<T extends LiveData<LiveDataVector>>(liveDataStore: T): T {
    ConsoleLogger.log('stores', 'setting live data');
    if (!liveDataStore) {
      throw new Error('Cannot set live data store to undefined/null');
    }
    this.liveData.set(liveDataStore);

    // We stop the previous engine from making predictions
    return get(this.liveData) as T;
  }

  /**
   *
   * @deprecated Use backend instead
   */
  public getClassifier(): Classifier {
    return this.classifier;
  }

  public getDevices(): Devices {
    return this.devices;
  }
}

export const stores = new Stores();
