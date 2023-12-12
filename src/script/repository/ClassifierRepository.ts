/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Writable, derived, get, writable } from 'svelte/store';
import StaticConfiguration from '../../StaticConfiguration';
import GestureConfidence from '../domain/GestureConfidence';
import NoneMLModel from '../mlmodels/NoneMLModel';
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

export type TrainerConsumer = <T extends MLModel>(
  trainer: ModelTrainer<T>,
) => Promise<void>;

class ClassifierRepository {
  private static confidences: Writable<Map<GestureID, number>>;
  private static mlModel: Writable<MLModel>;
  private static filters: Writable<Filters>;
  private static filterArray: Writable<Filter[]>;
  private classifierFactory: ClassifierFactory;

  constructor() {
    const initialConfidence = new Map<GestureID, number>();
    ClassifierRepository.confidences = writable(initialConfidence);
    ClassifierRepository.mlModel = writable(new NoneMLModel());
    ClassifierRepository.filterArray = writable([]);
    ClassifierRepository.filters = writable(
      new Filters(ClassifierRepository.filterArray),
    );
    this.classifierFactory = new ClassifierFactory();
    this.addAllFilters();
  }

  public getMLModel(): Readable<MLModel> {
    return {
      subscribe: ClassifierRepository.mlModel.subscribe,
    };
  }

  public getClassifier(): Classifier {
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

  private async trainModel<T extends MLModel>(trainer: ModelTrainer<T>): Promise<void> {
    const gestureRepository = Repositories.getInstance().getGestureRepository();
    const trainingData = this.classifierFactory.buildTrainingData(
      get(gestureRepository),
      get(ClassifierRepository.filters),
    );
    const model = await trainer.trainModel(trainingData);
    ClassifierRepository.mlModel.set(model);
  }

  private getTrainerConsumer(): TrainerConsumer {
    return <T extends MLModel>(trainer: ModelTrainer<T>) => this.trainModel(trainer);
  }

  private addAllFilters(): void {
    // todo to be removed
    ClassifierRepository.filters.set(
      new Filters(
        writable([
          new MaxFilter(),
          new MeanFilter(),
          new MinFilter(),
          new PeaksFilter(),
          new RootMeanSquareFilter(),
          new StandardDeviationFilter(),
          new TotalAccFilter(),
          new ZeroCrossingRateFilter(),
        ]),
      ),
    );
  }

  /* TODO: Should be private, but currently ml.ts is depending on it. That should change by removing the functionality from ml.ts and using classifier instead */
  public setGestureConfidence(gestureId: GestureID, confidence: number) {
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
