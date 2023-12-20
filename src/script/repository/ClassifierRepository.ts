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
import MaxFilter from '../filters/MaxFilter';
import MinFilter from '../filters/MinFilter';
import PeaksFilter from '../filters/PeaksFilter';
import { GestureID } from '../domain/Gesture';
import MeanFilter from '../filters/MeanFilter';
import RootMeanSquareFilter from '../filters/RootMeanSquareFilter';
import StandardDeviationFilter from '../filters/StandardDeviationFilter';
import TotalAccFilter from '../filters/TotalAccFilter';
import ZeroCrossingRateFilter from '../filters/ZeroCrossingRateFilter';
import { FilterType } from '../domain/FilterTypes';

export type TrainerConsumer = <T extends MLModel>(
  trainer: ModelTrainer<T>,
) => Promise<void>;

class ClassifierRepository {
  private static confidences: Writable<Map<GestureID, number>>;
  private static mlModel: Writable<MLModel | undefined>;
  private static filters: Filters;
  private static filterArray: Writable<Filter[]>;
  private classifierFactory: ClassifierFactory;

  constructor() {
    const initialConfidence = new Map<GestureID, number>();
    ClassifierRepository.confidences = writable(initialConfidence);
    ClassifierRepository.mlModel = writable(undefined);
    ClassifierRepository.filterArray = writable([]);

    // Create a 'Filters' store with an error callback for when
    ClassifierRepository.filters = new Filters(ClassifierRepository.filterArray);
    this.classifierFactory = new ClassifierFactory();
    this.addAllFilters();
  }

  public getMLModel(): Readable<MLModel | undefined> {
    return {
      subscribe: ClassifierRepository.mlModel.subscribe,
    };
  }

  public getClassifier(): Classifier {
    // TODO: We should cache this object, as it can function as a singleton. This would improve performance
    return this.classifierFactory.buildClassifier(
      ClassifierRepository.mlModel,
      this.getTrainerConsumer(),
      ClassifierRepository.filters,
      get(Repositories.getInstance().getGestureRepository()),
      (gestureId: GestureID, confidence: number) => {
        this.setGestureConfidence(gestureId, confidence);
      },
    );
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

  private addAllFilters(): void {
    // todo to be removed
    ClassifierRepository.filters.set([
      FilterType.MAX,
      FilterType.MIN,
      FilterType.MEAN,
      FilterType.PEAKS,
      FilterType.RMS,
      FilterType.ACC,
      FilterType.STD,
      FilterType.ZCR,
    ]);
  }

  private setGestureConfidence(gestureId: GestureID, confidence: number) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Cannot set gesture confidence. Must be in the range 0.0-1.0');
    }
    const newConfidences = get(ClassifierRepository.confidences);
    newConfidences.set(gestureId, confidence);
    ClassifierRepository.confidences.set(newConfidences);
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
