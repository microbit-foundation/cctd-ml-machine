import { Writable, writable } from 'svelte/store';
import { RecordingData } from '../stores/mlStore';
import Classifier from './Classifier';
import Filters from './Filters';
import Gesture, { GestureID } from './Gesture';
import Gestures from './Gestures';
import Model from './Model';
import { TrainingData } from './ModelTrainer';
import MLModel from './MLModel';
import ClassifierRepository, {
  TrainerConsumer,
} from '../repository/ClassifierRepository';

class ClassifierFactory {

  public buildClassifier(
    model: Writable<MLModel>,
    trainerConsumer: TrainerConsumer,
    filters: Writable<Filters>,
    gestures: Gesture[],
    confidenceSetter: (gestureId: GestureID, confidence: number) => void
  ): Classifier {
    return new Classifier(this.buildModel(trainerConsumer, model), filters, model, gestures, confidenceSetter);
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

  private buildModel(trainerConsumer: TrainerConsumer, mlModel: Writable<MLModel>) {
    const model = writable(new Model(trainerConsumer, mlModel));
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
