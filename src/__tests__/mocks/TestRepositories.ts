/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import GestureRepository from '../../script/domain/GestureRepository';
import Repositories from '../../script/domain/Repositories';
import LocalStorageClassifierRepository from '../../script/repository/LocalStorageClassifierRepository';
import TestGestureRepository from './TestGestureRepository';

class TestRepositories implements Repositories {
  private gestureRepository: GestureRepository;
  constructor() {
    this.gestureRepository = new TestGestureRepository();
  }

  getGestureRepository(): GestureRepository {
    return this.gestureRepository;
  }

  getClassifierRepository(): LocalStorageClassifierRepository {
    throw new Error('Method not implemented.');
  }
}

export default TestRepositories;
