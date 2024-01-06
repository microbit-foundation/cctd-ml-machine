/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import Gestures from '../script/domain/Gestures';
import Repositories from '../script/domain/Repositories';
import TestRepositories from './mocks/TestRepositories';

describe('Tests of Gestures', () => {
    let gestures: Gestures;
  beforeEach(() => {
    const repositories: Repositories = new TestRepositories();
    const gestureRepository = repositories.getGestureRepository();
    vitest.mock('../script/domain/Gestures', () => ({
        __esModule: true,
        default: Gestures
       }))
    //const gestures: Gestures = new Gestures(repositories.getGestureRepository());
  });

  test('Creating gesture does not throw', () => {
    expect(() => {
    }).not.toThrow();
  });
});
