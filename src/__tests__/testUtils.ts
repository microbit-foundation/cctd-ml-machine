/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import exampleDataset from '../exampleDataset.json';
export const repeat = (func: (a?: any) => any, n: number) => {
  for (let i = 0; i < n; i++) {
    func();
  }
};

export const generateRecordings = () => {
  return exampleDataset[0].recordings;
};
