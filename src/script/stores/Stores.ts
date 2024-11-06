/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  Invalidator,
  Readable,
  Subscriber,
  Unsubscriber,
  Writable,
  derived,
  get,
  writable,
} from 'svelte/store';
import Repositories from '../domain/Repositories';
import Classifier from '../domain/stores/Classifier';
import Engine from '../domain/stores/Engine';
import LiveData from '../domain/stores/LiveData';
import { LiveDataVector } from '../domain/stores/LiveDataVector';
import Gestures from '../domain/stores/gesture/Gestures';
import PollingPredictorEngine from '../engine/PollingPredictorEngine';
import LocalStorageRepositories from '../repository/LocalStorageRepositories';
import Logger from '../utils/Logger';
import Confidences from '../domain/stores/Confidences';
import HighlightedAxis from './HighlightedAxis';

type StoresType = {
  liveData: LiveData<LiveDataVector>;
};
/**
 * Stores is a container object, that allows for management of global stores.
 */
class Stores implements Readable<StoresType> {
  private liveData: Writable<LiveData<LiveDataVector> | undefined>;
  private engine: Engine | undefined;
  private classifier: Classifier;
  private gestures: Gestures;
  private confidences: Confidences;
  private highlightedAxis: HighlightedAxis;

  public constructor() {
    this.liveData = writable(undefined);
    this.engine = undefined;
    const repositories: Repositories = new LocalStorageRepositories();
    this.classifier = repositories.getClassifierRepository().getClassifier();
    this.confidences = repositories.getClassifierRepository().getConfidences();
    this.gestures = new Gestures(repositories.getGestureRepository());
    this.highlightedAxis = new HighlightedAxis(this.classifier);
  }

  public subscribe(
    run: Subscriber<StoresType>,
    invalidate?: Invalidator<StoresType> | undefined,
  ): Unsubscriber {
    return derived([this.liveData], stores => {
      if (!stores[0]) {
        throw new Error(
          'Cannot subscribe to stores, livedata is null or undefined, set it user setLiveData(...) first',
        );
      }
      return {
        liveData: stores[0],
      };
    }).subscribe(run, invalidate);
  }

  public setLiveData<T extends LiveData<LiveDataVector>>(liveDataStore: T): T {
    Logger.log('stores', 'setting live data');
    if (!liveDataStore) {
      throw new Error('Cannot set live data store to undefined/null');
    }
    this.liveData.set(liveDataStore);

    // We stop the previous engine from making predictions
    if (this.engine) {
      this.engine.stop();
    }
    this.engine = new PollingPredictorEngine(this.classifier, liveDataStore);
    return get(this.liveData) as T;
  }

  public getClassifier(): Classifier {
    return this.classifier;
  }

  public getGestures(): Gestures {
    return this.gestures;
  }

  public getEngine(): Engine {
    if (!this.engine) {
      throw new Error(
        'Cannot get engine store, the liveData store has not been set. You must set it using setLiveData(...)',
      );
    }
    return this.engine;
  }

  public getConfidences(): Confidences {
    return this.confidences;
  }

  public getHighlightedAxis(): HighlightedAxis {
    return this.highlightedAxis;
  }
}

export const stores = new Stores();
