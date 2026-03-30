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
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkModelSettings';

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

  public constructor() {
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

  getNeuralNetworkSettings(): AbstractState<NeuralNetworkSettingsImpl> {
    return this.neuralNetworkSettingsState;
  }

  getModelTrainingState(): AbstractState<ModelTrainingImpl> {
    return this.modelTrainingState;
  }

  getClassifier(): AbstractState<Classifier | undefined> {
    return this.classifier;
  }
}
