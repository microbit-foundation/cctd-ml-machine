/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
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

class LocalStorageRepositories implements Repositories {
  private gestureRepository: LocalStorageGestureRepository;

  private classifierRepository: LocalStorageClassifierRepository;

  private trainingDataRepository: LocalStorageTrainingDataRepository;

  private static instance: LocalStorageRepositories;

  constructor(snackbar: Snackbar) {
    if (LocalStorageRepositories.instance) {
      // Singleton
      throw new Error('Could not instantiate repository. It is already instantiated!');
    }
    LocalStorageRepositories.instance = this;
    const confidences = new Confidences();
    this.trainingDataRepository = new LocalStorageTrainingDataRepository(this);
    this.classifierRepository = new LocalStorageClassifierRepository(
      confidences,
      this.trainingDataRepository,
      snackbar,
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
}

export default LocalStorageRepositories;
