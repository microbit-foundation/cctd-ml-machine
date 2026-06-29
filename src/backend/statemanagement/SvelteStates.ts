/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { AbstractState } from './AbstractState';
import { SvelteStateAdapter } from './SvelteStateAdapter';
import type { AbstractStates } from './AbstractStates';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import { LiveDataStateAdapter } from '../interface-adapter/LiveDataStateAdapter';
import StaticConfiguration from '../../StaticConfiguration';
import { MicrobitRole } from '../domain/microbit/MicrobitRole';
import type { MicrobitConnection } from '../domain/microbit/MicrobitConnection';
import { MicrobitConnectionImpl } from '../domain/implementation/microbit/MicrobitConnectionImpl';
import { MicrobitConnectionStateImpl } from '../domain/implementation/microbit/MicrobitConnectionStateImpl';
import { MicrobitReconnectStateImpl } from '../domain/implementation/microbit/MicrobitReconnectStateImpl';
import type { MakeCodeProject } from '@microbit/makecode-embed';
import type { Axis } from '../../core/entities/Axis';
import type { Filter } from '../../core/filter/Filter';
import type { ValidationResult } from '../domain/implementation/validation/ValidationResult';
import { NeuralNetworkSettingsImpl } from '../../core/model/neural-network/NeuralNetworkSettingsImpl';
import { ModelTrainingImpl } from '../../core/model/ModelTrainingImpl';
import { DefaultNeuralNetworkModelLearningSettings } from '../interface-adapter/DefaultNeuralNetworkModelLearningSettings';
import { DefaultNeuralNetworkArchitecture } from '../interface-adapter/DefaultNeuralNetworkArchitecture';
import { LoggingNeuralNetworkTrainingObserver } from '../../core/model/neural-network/LoggingNeuralNetworkTrainingObserver';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { Classifier } from '../../core/classifier/Classifier';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';
import { KNNModelSettingsImpl } from '../../core/model/KNN/KNNModelSettingsImpl';
import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { ModelInfo } from '../../core/model/ModelInfo';
import ModelRegistry from '../../core/model/ModelRegistry';
import { Confidences } from '../../core/entities/Confidences';
import { GestureRecordingState } from '../domain/recording/GestureRecordingState';
import { RecordingSettings } from '../domain/recording/RecordingSettings';
import type { FeatureProvider } from '../application/feature/FeatureProvider';
import { Feature } from '../application/feature/Feature';
import type { LiveDataStore } from '../../core/LiveDataStore';
import { createFilter, getFilterTypes } from '../../core/filter/FilterUtils';
import type { PredictionOutput } from '../../core/classifier/PredictionOutput';
import type { Vector } from '../../core/vector/Vector';
import type { LabelledPoint } from '../../core/model/KNN/LabelledPoint';

export class SvelteStates implements AbstractStates {
  private predictionState: AbstractState<PredictionOutput | undefined>;
  private outputTargetState: AbstractState<OutputTarget>;
  private liveDataState: AbstractState<LiveDataStore<LiveDataVector>>;
  private microbitConnectionState: AbstractState<MicrobitConnection>;
  private makeCodeProjectState: AbstractState<MakeCodeProject | undefined>;
  private popupMessageState: AbstractState<string | undefined>;
  private enableFingerprintState: AbstractState<boolean>;
  private validationAutoUpdateState: AbstractState<boolean>;
  private availableAxesState: AbstractState<Axis[]>;
  private selectedAxesState: AbstractState<Axis[]>;
  private filtersState: AbstractState<Filter[]>;
  private validationResultState: AbstractState<ValidationResult | undefined>;
  private neuralNetworkSettingsState: AbstractState<NeuralNetworkModelSettings>;
  private modelTrainingState: AbstractState<ModelTrainingImpl>;
  private classifier: AbstractState<Classifier | undefined>;
  private gesturesState: AbstractState<NewGesture[]>;
  private knnModelSettingsState: AbstractState<KNNModelSettings>;
  private trainingIterationState: AbstractState<NeuralNetworkTrainingIteration[]>;
  private selectedModelState: AbstractState<ModelInfo>;
  private confidencesState: AbstractState<Confidences>;
  private recordingState: AbstractState<GestureRecordingState>;
  private recordingSettingsState: AbstractState<RecordingSettings>;
  private knnInputState: AbstractState<Vector | undefined>;
  private knnNearestNeighboursState: AbstractState<LabelledPoint[]>;

  private log = new ConsoleLogger(SvelteStates.name);

  public constructor(
    initialGestures: NewGesture[],
    featureProvider: FeatureProvider,
    private selectedGestureState: AbstractState<NewGesture | undefined>,
    initialAxes: Axis[],
  ) {
    this.predictionState = new SvelteStateAdapter(writable(undefined));
    this.liveDataState = new LiveDataStateAdapter(
      StaticConfiguration.accelerometerLiveDataBufferSize,
    );
    this.outputTargetState = new SvelteStateAdapter(
      writable(OutputTarget.OUTPUT_MICROBIT),
    );
    this.microbitConnectionState = new SvelteStateAdapter<MicrobitConnection>(
      writable(
        new MicrobitConnectionImpl(
          new MicrobitConnectionStateImpl(false, false, false, false, false),
          new MicrobitConnectionStateImpl(false, false, false, false, false),
          new MicrobitReconnectStateImpl(false, MicrobitRole.INPUT),
          false,
        ),
      ),
    );
    this.popupMessageState = new SvelteStateAdapter(writable(undefined));
    this.makeCodeProjectState = new SvelteStateAdapter(writable(undefined));
    this.enableFingerprintState = new SvelteStateAdapter(
      writable(StaticConfiguration.enableFingerprintByDefault),
    );
    this.validationAutoUpdateState = new SvelteStateAdapter(writable(false));
    this.availableAxesState = new SvelteStateAdapter(writable(initialAxes));
    this.selectedAxesState = new SvelteStateAdapter(writable(initialAxes));
    const allFilters = getFilterTypes().map(createFilter);
    this.filtersState = new SvelteStateAdapter(writable(allFilters));
    this.validationResultState = new SvelteStateAdapter(writable(undefined));
    const defaultFeatureCount = allFilters.length * this.selectedAxesState.get().length;
    this.neuralNetworkSettingsState = new SvelteStateAdapter(
      writable(
        new NeuralNetworkSettingsImpl(
          new DefaultNeuralNetworkModelLearningSettings(),
          new DefaultNeuralNetworkArchitecture(initialGestures.length, defaultFeatureCount),
          new LoggingNeuralNetworkTrainingObserver(
            new ConsoleLogger('LoggingNeuralNetworkTrainingObserver'),
          ),
        ),
      ),
    );
    this.modelTrainingState = new SvelteStateAdapter(writable(new ModelTrainingImpl()));
    this.classifier = new SvelteStateAdapter(writable<Classifier | undefined>(undefined));
    this.gesturesState = new SvelteStateAdapter(writable(initialGestures));
    this.knnModelSettingsState = new SvelteStateAdapter(
      writable(
        new KNNModelSettingsImpl(
          StaticConfiguration.defaultKnnNeighbourCount,
          0, // TODO: Maybe this should just be undefined, since it's based on the number of gestures. Maybe this shouldn't even be a part of the KNNModelSettings, since it's not really a setting, but rather a property of the dataset.
          false,
        ),
      ),
    );
    this.trainingIterationState = new SvelteStateAdapter(writable([]));
    this.selectedModelState = new SvelteStateAdapter(
      writable(ModelRegistry.NeuralNetwork),
    );
    this.confidencesState = new SvelteStateAdapter(writable(new Confidences(new Map())));
    this.recordingState = new SvelteStateAdapter(
      writable(new GestureRecordingState(false, undefined)),
    );
    this.recordingSettingsState = new SvelteStateAdapter(
      writable(
        new RecordingSettings(
          featureProvider.getFeature<number>(Feature.RECORDING_DURATION).getValue(),
          StaticConfiguration.pollingPredictionSampleSize,
        ),
      ),
    );
    this.knnInputState = new SvelteStateAdapter(writable(undefined));
    this.knnNearestNeighboursState = new SvelteStateAdapter(writable([]));
  }

  getKNNNearestNeighbours(): AbstractState<LabelledPoint[]> {
    return this.knnNearestNeighboursState;
  }

  getKNNInput(): AbstractState<Vector | undefined> {
    return this.knnInputState;
  }

  getPredictionState(): AbstractState<PredictionOutput | undefined> {
    return this.predictionState;
  }

  getRecordingSettings(): AbstractState<RecordingSettings> {
    return this.recordingSettingsState;
  }

  getRecordingState(): AbstractState<GestureRecordingState> {
    return this.recordingState;
  }

  getConfidences(): AbstractState<Confidences> {
    return this.confidencesState;
  }

  getSelectedModel(): AbstractState<ModelInfo> {
    return this.selectedModelState;
  }

  getSelectedGesture(): AbstractState<NewGesture | undefined> {
    return this.selectedGestureState;
  }

  getNeuralNetworkTrainingIterations(): AbstractState<NeuralNetworkTrainingIteration[]> {
    return this.trainingIterationState;
  }

  getKNNModelSettings(): AbstractState<KNNModelSettings> {
    return this.knnModelSettingsState;
  }

  setGestures(gestures: NewGesture[]): void {
    this.log.info(`Updating gestures state with ${gestures.length} gestures`);
    this.gesturesState.set(gestures);
  }

  getGestures(): AbstractState<NewGesture[]> {
    return this.gesturesState;
  }

  getValidationResult(): AbstractState<ValidationResult | undefined> {
    return this.validationResultState;
  }

  getFilters(): AbstractState<Filter[]> {
    return this.filtersState;
  }

  getSelectedAxes(): AbstractState<Axis[]> {
    return this.selectedAxesState;
  }

  getAvailableAxes(): AbstractState<Axis[]> {
    return this.availableAxesState;
  }
  getEnableFingerprint(): AbstractState<boolean> {
    return this.enableFingerprintState;
  }
  getValidationAutoUpdate(): AbstractState<boolean> {
    return this.validationAutoUpdateState;
  }
  getMakeCodeProject(): AbstractState<MakeCodeProject | undefined> {
    return this.makeCodeProjectState;
  }

  getMicrobitConnection(): AbstractState<MicrobitConnection> {
    return this.microbitConnectionState;
  }

  getLiveData(): AbstractState<LiveDataStore<LiveDataVector>> {
    return this.liveDataState;
  }

  getPopupMessage(): AbstractState<string | undefined> {
    return this.popupMessageState;
  }

  public getOutputTarget(): AbstractState<OutputTarget> {
    return this.outputTargetState;
  }

  getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings> {
    return this.neuralNetworkSettingsState;
  }

  getModelTraining(): AbstractState<ModelTrainingImpl> {
    return this.modelTrainingState;
  }

  getClassifier(): AbstractState<Classifier | undefined> {
    return this.classifier;
  }
}
