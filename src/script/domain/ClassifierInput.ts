/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Filters from './Filters';

interface ClassifierInput {
  getInput(filters: Filters): number[];
}

export default ClassifierInput;
