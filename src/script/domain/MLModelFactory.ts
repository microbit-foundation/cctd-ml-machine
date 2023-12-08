/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Axes from './Axes';
import Filters from './Filters';
import MLModel from './MLModel';

export type MLModelSettings = {
  axes: Axes[];
  filters: Filters;
};

interface MLModelFactory<T extends MLModel> {
  buildModel(settings: MLModelSettings): T;
}

export default MLModelFactory;
