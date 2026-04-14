/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import type { NeuralNetworkArchitecture } from '../../core/model/neural-network/NeuralNetworkArchitecture';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { NeuralNetworkTrainingObserver } from '../../core/model/neural-network/NeuralNetworkTrainingObserver';
import type { AbstractState } from '../statemanagement/AbstractState';
import { SvelteStateAdapter } from '../statemanagement/SvelteStateAdapter';
import type { Unsubscriber } from '../statemanagement/AbstractReadonlyState';

export class NeuralNetworkSettingsStateAdapter
  implements AbstractState<NeuralNetworkModelSettings>, NeuralNetworkModelSettings
{
  private state: AbstractState<NeuralNetworkModelSettings>;

  constructor(initialState: NeuralNetworkModelSettings) {
    if (!initialState) {
      throw new Error('Initial state may not be nullish');
    }
    this.state = new SvelteStateAdapter(writable(initialState));
  }

  public getArchitecture(): NeuralNetworkArchitecture {
    return this.state.get().getArchitecture();
  }

  public getTrainingObserver(): NeuralNetworkTrainingObserver {
    return this.state.get().getTrainingObserver();
  }

  public getLearningRate(): number {
    return this.state.get().getLearningRate();
  }

  public setLearningRate(learningRate: number): void {
    return this.state.update(e => {
      e.setLearningRate(learningRate);
      return e;
    });
  }

  public getNumberOfEpochs(): number {
    return this.state.get().getNumberOfEpochs();
  }

  public getBatchSize(): number {
    return this.state.get().getBatchSize();
  }

  public getValidationSplit(): number {
    return this.state.get().getValidationSplit();
  }

  public setNumberOfEpochs(numberOfEpochs: number): void {
    return this.state.update(e => {
      e.setNumberOfEpochs(numberOfEpochs);
      return e;
    });
  }

  public setBatchSize(batchSize: number): void {
    return this.state.update(e => {
      e.setBatchSize(batchSize);
      return e;
    });
  }

  public setValidationSplit(validationSplit: number): void {
    return this.state.update(e => {
      e.setValidationSplit(validationSplit);
      return e;
    });
  }

  public get(): NeuralNetworkModelSettings {
    return this.state.get();
  }

  public set(value: NeuralNetworkModelSettings): void {
    return this.state.set(value);
  }

  public update(
    updater: (currentValue: NeuralNetworkModelSettings) => NeuralNetworkModelSettings,
  ): void {
    return this.state.update(updater);
  }

  public subscribe(
    run: (value: NeuralNetworkModelSettings) => void,
    invalidate?: ((value?: NeuralNetworkModelSettings | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.state.subscribe(run, invalidate);
  }
}
