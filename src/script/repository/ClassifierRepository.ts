/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Writable, derived, get, writable } from 'svelte/store';
import StaticConfiguration from '../../StaticConfiguration';
import GestureConfidence from '../domain/GestureConfidence';
import MLModel from '../domain/MLModel';
import ModelTrainer from '../domain/ModelTrainer';
import ClassifierFactory from '../domain/ClassifierFactory';
import Repositories from './Repositories';
import Filters from '../domain/Filters';
import Classifier from '../domain/Classifier';
import Filter from '../domain/Filter';
import Gesture, { GestureID } from '../domain/Gesture';
import FilterTypes, { FilterType } from '../domain/FilterTypes';
import PersistantWritable from './PersistantWritable';

export type TrainerConsumer = <T extends MLModel>(
  trainer: ModelTrainer<T>,
) => Promise<void>;

class ClassifierRepository {
  private static readonly PERSISTANT_FILTERS_KEY = 'filters';
  private static confidences: Writable<Map<GestureID, number>>;
  private static mlModel: Writable<MLModel | undefined>;
  private static filters: Filters;
  private static persistedFilters: PersistantWritable<FilterType[]>;
  private classifierFactory: ClassifierFactory;

  constructor() {
    const initialConfidence = new Map<GestureID, number>();
    ClassifierRepository.confidences = writable(initialConfidence);
    ClassifierRepository.mlModel = writable(undefined);
    ClassifierRepository.persistedFilters = new PersistantWritable(
      FilterTypes.toIterable(),
      ClassifierRepository.PERSISTANT_FILTERS_KEY,
    );
    ClassifierRepository.filters = new Filters(this.getFilters());
    this.classifierFactory = new ClassifierFactory();
  }

  public getClassifier(): Classifier {
    const gestureRepository: Readable<Gesture[]> =
      Repositories.getInstance().getGestureRepository();
    // TODO: We should cache this object, as it can function as a singleton. This would improve performance
    const classifier = this.classifierFactory.buildClassifier(
      ClassifierRepository.mlModel,
      this.getTrainerConsumer(),
      ClassifierRepository.filters,
      gestureRepository,
      (gestureId: GestureID, confidence: number) => {
        this.setGestureConfidence(gestureId, confidence);
      },
    );

    return classifier;
  }

  /**
   * Takes a trainer as parameter and produces a MLModel. This function is passed into the classifier when built.
   * See getTrainerConsumer() and getClassifier()
   */
  private async trainModel<T extends MLModel>(trainer: ModelTrainer<T>): Promise<void> {
    const gestureRepository = Repositories.getInstance().getGestureRepository();
    const trainingData = this.classifierFactory.buildTrainingData(
      get(gestureRepository),
      ClassifierRepository.filters,
    );
    const model = await trainer.trainModel(trainingData);
    ClassifierRepository.mlModel.set(model);
  }

  private getTrainerConsumer(): TrainerConsumer {
    return <T extends MLModel>(trainer: ModelTrainer<T>) => this.trainModel(trainer);
  }

  private setGestureConfidence(gestureId: GestureID, confidence: number) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Cannot set gesture confidence. Must be in the range 0.0-1.0');
    }
    const newConfidences = get(ClassifierRepository.confidences);
    newConfidences.set(gestureId, confidence);
    ClassifierRepository.confidences.set(newConfidences);
  }

  private getFilters(): Writable<Filter[]> {
    // Create and fetch a persistant store
    const derivedStore = derived([ClassifierRepository.persistedFilters], stores => {
      const persistedFilters = stores[0];
      return persistedFilters.map(persistedFilter =>
        FilterTypes.createFilter(persistedFilter),
      );
    });
    // Convert a store of type 'FilterType' to type 'filter'.
    return {
      subscribe: derivedStore.subscribe,
      set: newFiltersArray =>
        ClassifierRepository.persistedFilters.set(
          newFiltersArray.map(newFilter => newFilter.getType()),
        ),
      update: updater => {
        const updatedStore = updater(get(derivedStore)).map(filter => filter.getType());
        ClassifierRepository.persistedFilters.set(updatedStore);
      },
    };
  }

  public getGestureConfidence(gestureId: number): GestureConfidence {
    const derivedConfidence = derived([ClassifierRepository.confidences], stores => {
      const confidenceStore = stores[0];
      if (confidenceStore.has(gestureId)) {
        return confidenceStore.get(gestureId) as number;
      }
      return 0;
    });
    return new GestureConfidence(
      StaticConfiguration.defaultRequiredConfidence,
      derivedConfidence,
    );
  }
}

export default ClassifierRepository;
