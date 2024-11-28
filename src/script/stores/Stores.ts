/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
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
import PollingPredictorEngine from '../engine/PollingPredictorEngine';
import LocalStorageRepositories from '../repository/LocalStorageRepositories';
import Logger from '../utils/Logger';
import Confidences from '../domain/stores/Confidences';
import HighlightedAxes from '../domain/stores/HighlightedAxis';
import SelectedModel from './SelectedModel';
import type { LiveDataVector } from '../domain/stores/LiveDataVector';
import type { LiveData } from '../domain/stores/LiveData';
import type { Engine } from '../domain/stores/Engine';
import type { Axis } from '../domain/Axis';
import AvailableAxes from '../domain/stores/AvailableAxes';

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
  private highlightedAxis: HighlightedAxes;
  private selectedModel: SelectedModel;
  private availableAxes: AvailableAxes;

  public constructor(private applicationState: Readable<ApplicationState>) {
    this.liveData = writable(undefined);
    this.engine = undefined;
    const repositories: Repositories = new LocalStorageRepositories();
    this.classifier = repositories.getClassifierRepository().getClassifier();
    this.confidences = repositories.getClassifierRepository().getConfidences();
    this.gestures = new Gestures(repositories.getGestureRepository());
    this.selectedModel = new SelectedModel();
    this.highlightedAxis = new HighlightedAxes(this.classifier, this.selectedModel, applicationState);
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
      if (!stores[0]) {
        throw new Error(
          'Cannot subscribe to stores, livedata is null or undefined, set it using setLiveData(...) first',
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
    this.engine = new PollingPredictorEngine(
      this.classifier,
      liveDataStore,
      this.highlightedAxis,
    );
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

  public getHighlightedAxes(): HighlightedAxes {
    return this.highlightedAxis;
  }

  public getSelectedModel(): SelectedModel {
    return this.selectedModel;
  }

  public getAvailableAxes(): Readable<Axis[]> {
    return this.availableAxes;
  }
}

export enum DeviceRequestStates {
  NONE,
  INPUT,
  OUTPUT,
}
export enum ModelView {
  TILE,
  STACK,
}
export interface ApplicationState {
  isRequestingDevice: DeviceRequestStates;
  isFlashingDevice: boolean;
  isRecording: boolean;
  isInputConnected: boolean;
  isOutputConnected: boolean;
  offerReconnect: boolean;
  requestDeviceWasCancelled: boolean;
  reconnectState: DeviceRequestStates;
  isInputReady: boolean;
  isInputAssigned: boolean;
  isOutputAssigned: boolean;
  isOutputReady: boolean;
  isInputInitializing: boolean;
  isLoading: boolean;
  modelView: ModelView;
  isInputOutdated: boolean;
  isOutputOutdated: boolean;
}
// Store current state to prevent error prone actions
export const state = writable<ApplicationState>({
  isRequestingDevice: DeviceRequestStates.NONE,
  isFlashingDevice: false,
  isRecording: false,
  isInputConnected: false,
  isOutputConnected: false,
  offerReconnect: false,
  requestDeviceWasCancelled: false,
  reconnectState: DeviceRequestStates.NONE,
  isInputReady: false,
  isInputAssigned: false,
  isOutputAssigned: false,
  isOutputReady: false,
  isInputInitializing: false,
  isLoading: true,
  modelView: ModelView.STACK,
  isInputOutdated: false,
  isOutputOutdated: false,
});

// TODO: It really should be the other way around. The ApplicationState should be depending on the Stores object, since it contains the internals
export const stores = new Stores(state);
