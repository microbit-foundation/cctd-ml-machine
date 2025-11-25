/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import type { AbstractState } from './AbstractState';
import type { ModelTraining } from '../../core/model/ModelTraining';
import { SvelteStateAdapter } from './SvelteStateAdapter';
import { ModelTrainingImpl } from '../../core/model/ModelTrainingImpl';
import type { Unsubscriber } from './AbstractReadonlyState';

export class ModelTrainingStateAdapter
  implements AbstractState<ModelTraining>, ModelTraining
{
  private state: AbstractState<ModelTraining>;

  constructor() {
    this.state = new SvelteStateAdapter(writable<ModelTraining>(new ModelTrainingImpl()));
  }

  setIsTraining(training: boolean): void {
    this.update(e => {
      e.setIsTraining(training);
      return e;
    });
  }

  public isTraining(): boolean {
    return this.get().isTraining();
  }

  get(): ModelTraining {
    return this.state.get();
  }

  set(value: ModelTraining): void {
    return this.state.set(value);
  }

  update(updater: (currentValue: ModelTraining) => ModelTraining): void {
    return this.state.update(updater);
  }

  subscribe(
    run: (value: ModelTraining) => void,
    invalidate?: ((value?: ModelTraining | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.state.subscribe(run, invalidate);
  }
}
