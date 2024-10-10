/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Writable, get, writable } from 'svelte/store';
import Classifier from './stores/Classifier';
import Filters from './Filters';
import { TrainingData } from './ModelTrainer';
import MLModel from './MLModel';
import { TrainerConsumer } from '../repository/LocalStorageClassifierRepository';
import Gesture, { GestureID } from './stores/gesture/Gesture';
import Model from './stores/Model';
import { RecordingData } from './stores/gesture/Gestures';

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
      const data = recording.data;
      return {
        value: [
          ...filters.compute(data.x),
          ...filters.compute(data.y),
          ...filters.compute(data.z),
        ],
      };
    });
  }
}

export default ClassifierFactory;
