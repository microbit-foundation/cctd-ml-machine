/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MakeCodeProject } from '@microbit/makecode-embed';
import type { LiveDataStore } from '../../core/LiveDataStore';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { MicrobitConnection } from '../domain/microbit/MicrobitConnection';
import type { AbstractState } from './AbstractState';
import type { Axis } from '../../core/entities/Axis';
import type { Filter } from '../../core/filter/Filter';
import type { ValidationResult } from '../domain/implementation/validation/ValidationResult';
import type { ModelTrainingImpl } from '../../core/model/ModelTrainingImpl';
import type { Classifier } from '../../core/classifier/Classifier';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { AbstractReadonlyState } from './AbstractReadonlyState';

/**
 * Both used as a reactive state interface and data source for the backend
 */
export interface AbstractStates {
  getClassifier(): AbstractState<Classifier | undefined>;
  getGestures(): AbstractReadonlyState<NewGesture[]>;
  getValidationResult(): AbstractState<ValidationResult | undefined>;
  getFilters(): AbstractState<Filter[]>;
  getAvailableAxes(): AbstractState<Axis[] | undefined>;
  getSelectedAxes(): AbstractState<Axis[] | undefined>;
  getEnableFingerprint(): AbstractState<boolean>;
  getMakeCodeProject(): AbstractState<MakeCodeProject | undefined>;
  getOutputTarget(): AbstractState<OutputTarget>;
  getLiveData(): AbstractState<LiveDataStore<LiveDataVector>>;
  getMicrobitConnection(): AbstractState<MicrobitConnection>;
  getPopupMessage(): AbstractState<string | undefined>;
  getValidationAutoUpdate(): AbstractState<boolean>;
  getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings>;
  getModelTrainingState(): AbstractState<ModelTrainingImpl>;
}
