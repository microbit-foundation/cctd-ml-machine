/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type Readable, type Writable, get, writable } from 'svelte/store';
import Classifier from './stores/Classifier';
import Filters from './Filters';
import { type TrainingData } from './ModelTrainer';
import { type TrainerConsumer } from '../repository/LocalStorageClassifierRepository';
import Gesture, { type GestureID } from './stores/gesture/Gesture';
import Model from './stores/Model';
import { type RecordingData } from './stores/gesture/Gestures';
import type { MLModel } from './MLModel';

class ClassifierFactory {
  public buildClassifier(
    model: Writable<MLModel | undefined>,
    trainerConsumer: TrainerConsumer,
    filters: Filters,
    gestures: Readable<Gesture[]>,
    confidenceSetter: (gestureId: GestureID, confidence: number) => void,
  ): Classifier {
    const classifier = new Classifier(
      this.buildModel(trainerConsumer, model),
      filters,
      gestures,
      confidenceSetter,
    );
    filters.subscribe(() => {
      // Filters has changed
      classifier.getModel().markAsUntrained();
    });
    const noOfGesturesStore = writable(0);
    gestures.subscribe(newVal => {
      if (newVal.length != get(noOfGesturesStore)) {
        noOfGesturesStore.set(newVal.length);
      }
    });
    // Gesture was removed or added (doesn't detect if number of recordings change)
    noOfGesturesStore.subscribe(() => {
      classifier.getModel().markAsUntrained();
    });
    return classifier;
  }

  public buildTrainingData(gestures: Gesture[], filters: Filters): TrainingData {
    const classes = gestures.map(gesture => {
      return {
        samples: this.buildFilteredSamples(gesture.getRecordings(), filters),
      };
    });

    return {
      classes,
    };
  }

  private buildModel(
    trainerConsumer: TrainerConsumer,
    mlModel: Writable<MLModel | undefined>,
  ): Model {
    const model = new Model(trainerConsumer, mlModel);
    return model;
  }

  private buildFilteredSamples(recordings: RecordingData[], filters: Filters) {
    return recordings.map(recording => {
      const data = recording.samples;
      return {
        value: [
          ...filters.compute(data.map(e => e.vector[0])),
          ...filters.compute(data.map(e => e.vector[1])),
          ...filters.compute(data.map(e => e.vector[2])),
        ],
      };
    });
  }
}

export default ClassifierFactory;
