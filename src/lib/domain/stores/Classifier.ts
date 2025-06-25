/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
  derived,
  get,
  writable,
} from 'svelte/store';
import Filters from '../Filters';
import Model, { type ModelData } from './Model';
import Gesture, { type GestureID } from './gesture/Gesture';
import type { ClassifierInput } from '../ClassifierInput';
import Logger from '../../utils/Logger';
import BaseVector from '../BaseVector';

type ClassifierData = {
  model: ModelData;
  filteredInput: BaseVector;
};

class Classifier implements Readable<ClassifierData> {
  private filteredInput: Writable<BaseVector>;
  constructor(
    private model: Model,
    private filters: Filters,
    private gestures: Readable<Gesture[]>,
    private confidenceSetter: (gestureId: GestureID, confidence: number) => void,
  ) {
    this.filteredInput = writable(new BaseVector([]));
    Logger.log('classifier', 'Initialized classifier');
  }

  public subscribe(
    run: Subscriber<ClassifierData>,
    invalidate?: ((value?: ClassifierData | undefined) => void) | undefined,
  ): Unsubscriber {
    return derived([this.model, this.filteredInput], stores => {
      const modelStore = stores[0];
      const filteredInputStore = stores[1];
      return {
        model: modelStore,
        filteredInput: filteredInputStore,
      };
    }).subscribe(run, invalidate);
  }

  /**
   * Takes in a ClassifierInput object and updates the GestureConfidence store of each Gesture
   */
  public async classify(input: ClassifierInput): Promise<void> {
    const filteredInput = new BaseVector(input.getInput(this.filters));
    this.filteredInput.set(filteredInput);
    const predictions = await this.getModel().predict(filteredInput);
    predictions.forEach((confidence, index) => {
      const gesture = get(this.gestures)[index];
      this.confidenceSetter(gesture.getId(), confidence);
    });
  }

  public getFilters(): Filters {
    return this.filters;
  }

  /**
   * Returns the Model store
   */
  public getModel(): Model {
    return this.model;
  }
}

export default Classifier;
