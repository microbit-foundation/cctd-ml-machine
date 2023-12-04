/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import GestureRepository from './GestureRepository';
import ClassifierRepository from './ClassifierRepository';

class Repositories {
  private gestureRepository: GestureRepository;

  private classifierRepository: ClassifierRepository;

  private static instance: Repositories;

  constructor() {
    if (Repositories.instance) {
      // Singleton
      throw new Error('Could not instantiate repository. It is already instantiated!');
    }
    Repositories.instance = this;
    this.classifierRepository = new ClassifierRepository();
    this.gestureRepository = new GestureRepository(this.classifierRepository);
  }

  public static getInstance() {
    return this.instance;
  }

  public getGestureRepository() {
    return this.gestureRepository;
  }

  public getModelRepository() {
    return this.classifierRepository;
  }
}

export default Repositories;
