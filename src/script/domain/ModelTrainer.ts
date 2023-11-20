import MLModel from './MLModel';

// Todo: move to modeltrainer
export type TrainingData = {
  classes: {
    samples: {
      value: number[];
    }[];
  }[];
};

interface ModelTrainer<T extends MLModel> {
  trainModel(trainingData: TrainingData): Promise<T>;
}

export default ModelTrainer;
