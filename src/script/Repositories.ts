/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import GestureRepository from './gestures/GestureRepository';
import ModelRepository from './stores/ModelRepository';

class Repositories {
  private gestureRepository: GestureRepository;

  private modelRepository: ModelRepository;

  private static instance: Repositories;

  constructor() {
    if (Repositories.instance) {
      // Singleton
      throw new Error('Could not instantiate repository. It is already instantiated!');
    }
    Repositories.instance = this;
    this.modelRepository = new ModelRepository();
    this.gestureRepository = new GestureRepository(this.modelRepository);
  }

  public static getInstance() {
    return this.instance;
  }

  public getGestureRepository() {
    return this.gestureRepository;
  }

  public getModelRepository() {
    return this.modelRepository;
  }
}

export default Repositories;
