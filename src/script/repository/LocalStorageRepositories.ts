/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import LocalStorageGestureRepository from './LocalStorageGestureRepository';
import LocalStorageClassifierRepository from './LocalStorageClassifierRepository';
import Repositories from '../domain/Repositories';
import Confidences from '../domain/stores/Confidences';

class LocalStorageRepositories implements Repositories {
  private gestureRepository: LocalStorageGestureRepository;

  private classifierRepository: LocalStorageClassifierRepository;

  private static instance: LocalStorageRepositories;

  constructor() {
    if (LocalStorageRepositories.instance) {
      // Singleton
      throw new Error('Could not instantiate repository. It is already instantiated!');
    }
    LocalStorageRepositories.instance = this;
    const confidences = new Confidences();
    this.classifierRepository = new LocalStorageClassifierRepository(confidences);
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
}

export default LocalStorageRepositories;
