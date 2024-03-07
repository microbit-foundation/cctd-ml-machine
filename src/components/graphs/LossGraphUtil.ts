/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

// TODO: Where to place this? It is used in the LayersModelTrainer, and maybe in other trainers in the future.
//       It is primarily used by graph <LossGraph/> at the moment (28. feb 24)
export type LossTrainingIteration = {
  loss: number;
  epoch: number;
};
