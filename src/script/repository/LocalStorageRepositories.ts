/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import LocalStorageGestureRepository from './LocalStorageGestureRepository';
import LocalStorageClassifierRepository from './LocalStorageClassifierRepository';
import GestureRepository from '../domain/GestureRepository';
import Repositories from '../domain/Repositories';

class LocalStorageRepositories implements Repositories {
  private gestureRepository: GestureRepository;

  private classifierRepository: LocalStorageClassifierRepository;

  private static instance: LocalStorageRepositories;

  constructor() {
    if (LocalStorageRepositories.instance) {
      // Singleton
      throw new Error('Could not instantiate repository. It is already instantiated!');
    }
    LocalStorageRepositories.instance = this;
    this.classifierRepository = new LocalStorageClassifierRepository();
    this.gestureRepository = new LocalStorageGestureRepository(this.classifierRepository);
  }

  public static getInstance() {
    return this.instance;
  }

  public getGestureRepository(): GestureRepository {
    return this.gestureRepository;
  }

  public getClassifierRepository(): LocalStorageClassifierRepository {
    return this.classifierRepository;
  }
}

export default LocalStorageRepositories;
