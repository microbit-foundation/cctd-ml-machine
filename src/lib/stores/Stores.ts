/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
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
import HighlightedAxes from '../domain/stores/HighlightedAxes';
import SelectedModel from '../domain/SelectedModel';
import type { LiveDataVector } from '../domain/stores/LiveDataVector';
import type { LiveData } from '../domain/stores/LiveData';
import type { Engine } from '../domain/stores/Engine';
import AvailableAxes from '../domain/stores/AvailableAxes';
import NeuralNetworkSettings from '../domain/stores/NeuralNetworkSettings';
import KNNModelSettings from '../domain/stores/KNNModelSettings';
import ValidationSets from '../domain/stores/ValidationSets';
import { Recorder } from '../domain/stores/Recorder';
import ValidationResults from '../domain/stores/ValidationResults';
import Snackbar from '../../components/features/snackbar/Snackbar';

type StoresType = {
  liveData: LiveData<LiveDataVector> | undefined;
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
  private snackbar: Snackbar;
  private neuralNetworkSettings: NeuralNetworkSettings;
  private knnModelSettings: KNNModelSettings;
  private validationSets: ValidationSets;
  private validationResults: ValidationResults;
  private recorder: Recorder;

  public constructor(private applicationState: Readable<ApplicationState>) {
    this.neuralNetworkSettings = new NeuralNetworkSettings();
    this.snackbar = new Snackbar();
    this.liveData = writable(undefined);
    this.recorder = new Recorder();
    this.engine = undefined;
    const repositories: Repositories = new LocalStorageRepositories(this.snackbar);
    this.classifier = repositories.getClassifierRepository().getClassifier();
    this.confidences = repositories.getClassifierRepository().getConfidences();
    this.gestures = new Gestures(repositories.getGestureRepository());
    this.selectedModel = new SelectedModel();
    this.knnModelSettings = new KNNModelSettings(this.selectedModel);
    this.highlightedAxis = new HighlightedAxes(
      this.classifier,
      this.selectedModel,
      applicationState,
      this.snackbar,
    );
    this.availableAxes = new AvailableAxes(this.liveData, this.gestures);
    this.availableAxes.subscribe(newAxes => {
      this.highlightedAxis.set(newAxes);
    });
    this.validationSets = new ValidationSets(this.gestures);
    this.validationResults = new ValidationResults(
      this.validationSets,
      this.classifier,
      this.gestures,
      this.highlightedAxis,
    );
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

  public getAvailableAxes(): AvailableAxes {
    return this.availableAxes;
  }

  public getSnackbar() {
    return this.snackbar;
  }

  public getNeuralNetworkSettings() {
    return this.neuralNetworkSettings;
  }

  public getKNNModelSettings() {
    return this.knnModelSettings;
  }

  public getValidationSets(): ValidationSets {
    return this.validationSets;
  }

  public getValidationResults(): ValidationResults {
    return this.validationResults;
  }

  public getRecorder(): Recorder {
    return this.recorder;
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

export const stores = new Stores(state);
