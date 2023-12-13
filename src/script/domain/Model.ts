/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  Readable,
  Subscriber,
  Unsubscriber,
  Writable,
  get,
  writable,
} from 'svelte/store';
import MLModel from './MLModel';
import { TrainerConsumer } from '../repository/ClassifierRepository';
import ModelTrainer from './ModelTrainer';

export enum TrainingStatus {
  Untrained,
  InProgress,
  Success,
  Failure,
}

export enum ModelType {
  LAYERS,
}

export type ModelData = {
  trainingStatus: TrainingStatus;
};

class Model implements Readable<ModelData> {
  private modelData: Writable<ModelData>;

  constructor(
    private trainerConsumer: TrainerConsumer,
    private mlModel: Readable<MLModel | undefined>,
  ) {
    this.modelData = writable({
      trainingStatus: TrainingStatus.Untrained,
    });
  }

  public async train<T extends MLModel>(modelTrainer: ModelTrainer<T>): Promise<void> {
    this.modelData.update(state => {
      state.trainingStatus = TrainingStatus.InProgress;
      return state;
    });
    try {
      await this.trainerConsumer(modelTrainer);
      this.modelData.update(state => {
        state.trainingStatus = TrainingStatus.Success;
        return state;
      });
    } catch (err) {
      this.modelData.update(state => {
        state.trainingStatus = TrainingStatus.Failure;
        return state;
      });
      console.error(err);
    }
  }

  /**
   * Whether a model has been trained successfully.
   */
  public isTrained(): boolean {
    return get(this.modelData).trainingStatus === TrainingStatus.Success;
  }

  /**
   * Returns true if a MLModel is specified. Returns false if MLModel is undefined. Note canPredict may be true, even if isTrained() is false.
   */
  public canPredict(): boolean {
    return get(this.mlModel) != undefined;
  }

  /**
   * Marks the model as untrained. If model was previously trained, the predict method will still work, because the model doesn't get dropped
   */
  public markAsUntrained(): void {
    this.modelData.update(updater => {
      updater.trainingStatus = TrainingStatus.Untrained
      return updater;
    });
  }

  public async predict(inputData: number[]): Promise<number[]> {
    const mlModel = get(this.mlModel);
    if (!mlModel) {
      throw new Error("Cannot predict, no MLModel has been specified")
    }
    return await mlModel.predict(inputData);
  }

  public subscribe(
    run: Subscriber<ModelData>,
    invalidate?: ((value?: ModelData | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.modelData.subscribe(run, invalidate);
  }
}

export default Model;
