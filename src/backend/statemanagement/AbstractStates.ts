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
import type { Classifier } from '../../core/classifier/Classifier';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { AbstractReadonlyState } from './AbstractReadonlyState';
import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';
import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { ModelTraining } from '../../core/model/ModelTraining';
import type { ModelInfo } from '../../core/model/ModelInfo';
import type { Confidences } from '../../core/entities/Confidences';
import type { GestureRecordingState } from '../domain/recording/GestureRecordingState';
import type { RecordingSettings } from '../domain/recording/RecordingSettings';
import type { PredictionOutput } from '../../core/classifier/PredictionOutput';
import type { Vector } from '../../core/vector/Vector';

/**
 * Both used as a reactive state interface and data source for the backend
 */
export interface AbstractStates {
  getKNNInput(): AbstractState<Vector | undefined>;
  getPredictionState(): AbstractState<PredictionOutput | undefined>;
  getRecordingSettings(): AbstractState<RecordingSettings>;
  getRecordingState(): AbstractState<GestureRecordingState>;
  getNeuralNetworkTrainingIterations(): AbstractState<NeuralNetworkTrainingIteration[]>;
  getKNNModelSettings(): AbstractState<KNNModelSettings>;
  setGestures(gestures: NewGesture[]): void;
  getClassifier(): AbstractState<Classifier | undefined>;
  getConfidences(): AbstractState<Confidences>;
  getGestures(): AbstractReadonlyState<NewGesture[]>;
  getValidationResult(): AbstractState<ValidationResult | undefined>;
  getFilters(): AbstractState<Filter[]>;
  getAvailableAxes(): AbstractState<Axis[]>;
  getSelectedAxes(): AbstractState<Axis[]>;
  getEnableFingerprint(): AbstractState<boolean>;
  getMakeCodeProject(): AbstractState<MakeCodeProject | undefined>;
  getOutputTarget(): AbstractState<OutputTarget>;
  getLiveData(): AbstractState<LiveDataStore<LiveDataVector>>;
  getMicrobitConnection(): AbstractState<MicrobitConnection>;
  getPopupMessage(): AbstractState<string | undefined>;
  getValidationAutoUpdate(): AbstractState<boolean>;
  getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings>;
  getModelTraining(): AbstractState<ModelTraining>;
  getSelectedModel(): AbstractState<ModelInfo>;
  getSelectedGesture(): AbstractState<NewGesture | undefined>;
}
