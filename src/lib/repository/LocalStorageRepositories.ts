/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import LocalStorageGestureRepository from './LocalStorageGestureRepository';
import LocalStorageClassifierRepository from './LocalStorageClassifierRepository';
import Confidences from '../domain/stores/Confidences';
import LocalStorageTrainingDataRepository from './LocalStorageTrainingDataRepository';
import type { Repositories } from '../domain/Repositories';
import type { TrainingDataRepository } from '../domain/TrainingDataRepository';
import type Snackbar from '../../components/snackbar/Snackbar';
import { LocalStorageFiltersRepository } from './LocalStorageFiltersRepository';
import type { FiltersRepository } from '../domain/FiltersRepository';
import type PredictedPointLiveData from '../livedata/PredictedPointLiveData';

class LocalStorageRepositories implements Repositories {
  private gestureRepository: LocalStorageGestureRepository;

  private classifierRepository: LocalStorageClassifierRepository;

  private trainingDataRepository: LocalStorageTrainingDataRepository;

  private filtersRepository: LocalStorageFiltersRepository;

  private static instance: LocalStorageRepositories;

  constructor(snackbar: Snackbar) {
    if (LocalStorageRepositories.instance) {
      // Singleton
      throw new Error('Could not instantiate repository. It is already instantiated!');
    }
    LocalStorageRepositories.instance = this;
    const confidences = new Confidences();
    this.filtersRepository = new LocalStorageFiltersRepository();
    this.trainingDataRepository = new LocalStorageTrainingDataRepository(
      this,
      this.filtersRepository,
    );
    this.classifierRepository = new LocalStorageClassifierRepository(
      confidences,
      this.trainingDataRepository,
      snackbar,
      this.filtersRepository,
    );
    this.gestureRepository = new LocalStorageGestureRepository(this.classifierRepository);
  }

  public static getInstance() {
    return this.instance;
  }

  public getGestureRepository() {
    return this.gestureRepository;
  }

  public getClassifierRepository() {
    return this.classifierRepository;
  }

  public getTrainingDataRepository(): TrainingDataRepository {
    return this.trainingDataRepository;
  }

  public getFiltersRepository(): FiltersRepository {
    return this.filtersRepository;
  }
}

export default LocalStorageRepositories;
