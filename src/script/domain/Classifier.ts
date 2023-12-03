/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Subscriber, Unsubscriber, Writable, derived, get } from 'svelte/store';
import Model, { ModelData } from './Model';
import AccelerometerClassifierInput from '../mlmodels/AccelerometerClassifierInput';
import Filters from './Filters';
import Gesture, { GestureID } from './Gesture';
import ClassifierInput from './ClassifierInput';

type ClassifierData = {
  model: ModelData;
};

class Classifier implements Readable<ClassifierData> {
  constructor(
    private model: Model,
    private filters: Writable<Filters>,
    private gestures: Gesture[],
    private confidenceSetter: (gestureId: GestureID, confidence: number) => void,
  ) {}

  public subscribe(
    run: Subscriber<ClassifierData>,
    invalidate?: ((value?: ClassifierData | undefined) => void) | undefined,
  ): Unsubscriber {
    return derived([this.model], stores => {
      const modelStore = stores[0];
      return {
        model: modelStore,
      };
    }).subscribe(run, invalidate);
  }

  public async classify(input: ClassifierInput): Promise<void> {
    const filteredInput = input.getInput(get(this.filters));
    const predictions = await this.getModel().predict(filteredInput);
    predictions.forEach((confidence, index) => {
      const gesture = this.gestures[index];
      this.confidenceSetter(gesture.getId(), confidence);
    });
  }

  public getModel(): Model {
    return this.model;
  }
}

export default Classifier;
