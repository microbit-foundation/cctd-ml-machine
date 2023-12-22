/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable, Writable } from 'svelte/store';
import { RecordingData } from '../stores/mlStore';
import Classifier from './Classifier';
import Filters from './Filters';
import Gesture, { GestureID } from './Gesture';
import Model from './Model';
import { TrainingData } from './ModelTrainer';
import MLModel from './MLModel';
import { TrainerConsumer } from '../repository/ClassifierRepository';

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
    gestures.subscribe(() => {
      // Gesture was removed or added (doesn't detect if number of recordings change)
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
