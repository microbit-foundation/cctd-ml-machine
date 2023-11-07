/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Repositories from '../Repositories';
import Gestures from './Gestures';

const repositories = new Repositories();

export const gestures: Gestures = new Gestures(repositories.getGestureRepository());
