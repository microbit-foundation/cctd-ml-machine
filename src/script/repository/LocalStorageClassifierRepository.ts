/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import PersistantWritable from './PersistantWritable';
import { type Readable, type Writable, derived, get, writable } from 'svelte/store';
import StaticConfiguration from '../../StaticConfiguration';
import type { MLModel } from '../domain/MLModel';
import type { ModelTrainer } from '../domain/ModelTrainer';
import ClassifierFactory from '../domain/ClassifierFactory';
import LocalStorageRepositories from './LocalStorageRepositories';
import Filters from '../domain/Filters';
import FilterTypes, { FilterType } from '../domain/FilterTypes';
import Gesture, { type GestureID } from '../domain/stores/gesture/Gesture';
import Classifier from '../domain/stores/Classifier';
import GestureConfidence from '../domain/stores/gesture/GestureConfidence';
import Confidences from '../domain/stores/Confidences';
import type { ClassifierRepository } from '../domain/ClassifierRepository';
import type { TrainingDataRepository } from '../domain/TrainingDataRepository';
import type Snackbar from '../../components/snackbar/Snackbar';
import { t } from '../../i18n';
import type { FiltersRepository } from '../domain/FiltersRepository';
import type PredictedPointLiveData from '../livedata/PredictedPointLiveData';

export type TrainerConsumer = <T extends MLModel>(
  trainer: ModelTrainer<T>,
) => Promise<void>;

class LocalStorageClassifierRepository implements ClassifierRepository {
  private static mlModel: Writable<MLModel | undefined>;
  private classifierFactory: ClassifierFactory;

  constructor(
    private confidences: Confidences,
    private trainingDataRepository: TrainingDataRepository,
    private snackbar: Snackbar,
    private filtersRepository: FiltersRepository,
    private predictedPointData: PredictedPointLiveData,
  ) {
    LocalStorageClassifierRepository.mlModel = writable(undefined);
    this.classifierFactory = new ClassifierFactory();
  }

  public getClassifier(): Classifier {
    const gestureRepository: Readable<Gesture[]> =
      LocalStorageRepositories.getInstance().getGestureRepository();
    // TODO: We should cache this object, as it can function as a singleton. This would improve performance
    const classifier = this.classifierFactory.buildClassifier(
      LocalStorageClassifierRepository.mlModel,
      this.getTrainerConsumer(),
      this.filtersRepository.getFilters(),
      gestureRepository,
      (gestureId: GestureID, confidence: number) => {
        this.setGestureConfidence(gestureId, confidence);
      },
      this.snackbar,
      this.predictedPointData,
    );

    return classifier;
  }

  /**
   * Takes a trainer as parameter and produces a MLModel. This function is passed into the classifier when built.
   * See getTrainerConsumer() and getClassifier()
   */
  private async trainModel<T extends MLModel>(trainer: ModelTrainer<T>): Promise<void> {
    const model = await trainer.trainModel(this.trainingDataRepository);
    this.snackbar.sendMessage(get(t)('snackbar.modeltrained'));
    LocalStorageClassifierRepository.mlModel.set(model);
  }

  private getTrainerConsumer(): TrainerConsumer {
    return <T extends MLModel>(trainer: ModelTrainer<T>) => this.trainModel(trainer);
  }

  /* TODO: feels wrong to have this in the classifier repository, maybe? Shouldn't confidence relate to gestures? */
  public setGestureConfidence(gestureId: GestureID, confidence: number) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Cannot set gesture confidence. Must be in the range 0.0-1.0');
    }
    this.confidences.setConfidence(gestureId, confidence);
  }

  public getGestureConfidence(gestureId: number): GestureConfidence {
    const derivedConfidence = derived([this.confidences], stores => {
      const confidenceStore = stores[0];
      if (confidenceStore.has(gestureId)) {
        return confidenceStore.get(gestureId) as number;
      }
      throw new Error("No confidence found for gesture with id '" + gestureId + "'");
    });
    return new GestureConfidence(
      StaticConfiguration.defaultRequiredConfidence,
      derivedConfidence,
    );
  }

  public hasGestureConfidence(gestureId: number): boolean {
    return get(this.confidences).has(gestureId);
  }

  public getConfidences(): Confidences {
    return this.confidences;
  }
}

export default LocalStorageClassifierRepository;
