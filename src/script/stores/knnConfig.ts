/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import StaticConfiguration from '../../StaticConfiguration';
import PersistantWritable from '../repository/PersistantWritable';

export type KNNSettings = {
  k: number;
};

export const knnConfig = new PersistantWritable({
  k: StaticConfiguration.defaultKnnNeighbourCount,
}, 'knnConfig');
