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
import type { LiveData } from '../../lib/domain/stores/LiveData';
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
import { DefaultNeuralNetworkModelBaseSettings } from '../interface-adapter/DefaultNeuralNetworkModelBaseSettings';
import { DefaultNeuralNetworkArchitecture } from '../interface-adapter/DefaultNeuralNetworkArchitecture';
import { LoggingNeuralNetworkTrainingObserver } from '../../core/model/neural-network/LoggingNeuralNetworkTrainingObserver';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { Classifier } from '../../core/classifier/Classifier';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';
import type { AbstractReadonlyState } from './AbstractReadonlyState';
import { KNNModelSettingsImpl } from '../../core/model/KNN/KNNModelSettingsImpl';
import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { ModelInfo } from '../../core/model/ModelInfo';
import ModelRegistry from '../../core/model/ModelRegistry';

export class SvelteStates implements AbstractStates {
  private outputTargetState: AbstractState<OutputTarget>;
  private liveDataState: AbstractState<LiveData<LiveDataVector>>;
  private microbitConnectionState: AbstractState<MicrobitConnection>;
  private makeCodeProjectState: AbstractState<MakeCodeProject | undefined>;
  private popupMessageState: AbstractState<string | undefined>;
  private enableFingerprintState: AbstractState<boolean>;
  private validationAutoUpdateState: AbstractState<boolean>;
  private availableAxesState: AbstractState<Axis[] | undefined>;
  private selectedAxesState: AbstractState<Axis[] | undefined>;
  private filtersState: AbstractState<Filter[]>;
  private validationResultState: AbstractState<ValidationResult | undefined>;
  private neuralNetworkSettingsState: AbstractState<NeuralNetworkModelSettings>;
  private modelTrainingState: AbstractState<ModelTrainingImpl>;
  private classifier: AbstractState<Classifier | undefined>;
  private gesturesState: AbstractState<NewGesture[]>;
  private knnModelSettingsState: AbstractState<KNNModelSettings>;
  private trainingIterationState: AbstractState<NeuralNetworkTrainingIteration[]>;
  private selectedModelState: AbstractState<ModelInfo>;

  public constructor(initialGestures: NewGesture[]) {
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
    this.validationAutoUpdateState = new SvelteStateAdapter(writable(true));
    this.availableAxesState = new SvelteStateAdapter(writable(undefined));
    this.selectedAxesState = new SvelteStateAdapter(writable(undefined));
    this.filtersState = new SvelteStateAdapter(writable([]));
    this.validationResultState = new SvelteStateAdapter(writable(undefined));
    this.neuralNetworkSettingsState = new SvelteStateAdapter(
      writable(
        new NeuralNetworkSettingsImpl(
          new DefaultNeuralNetworkModelBaseSettings(),
          new DefaultNeuralNetworkArchitecture(),
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
  }
  getSelectedModel(): AbstractState<ModelInfo> {
    throw new Error('Method not implemented.');
  }

  getNeuralNetworkTrainingIterations(): AbstractState<NeuralNetworkTrainingIteration[]> {
    return this.trainingIterationState;
  }

  getKNNModelSettings(): AbstractState<KNNModelSettings> {
    return this.knnModelSettingsState;
  }

  setGestures(gestures: NewGesture[]): void {
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

  getSelectedAxes(): AbstractState<Axis[] | undefined> {
    return this.selectedAxesState;
  }

  getAvailableAxes(): AbstractState<Axis[] | undefined> {
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

  getLiveData(): AbstractState<LiveData<LiveDataVector>> {
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
