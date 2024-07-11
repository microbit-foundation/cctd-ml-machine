/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { persistantWritable } from './storeUtil';
import StaticConfiguration from '../../StaticConfiguration';

export type KNNSettings = {
  k: number;
};

export const knnConfig = persistantWritable<KNNSettings>('knnConfig', {
  k: StaticConfiguration.defaultKnnNeighbourCount,
});
