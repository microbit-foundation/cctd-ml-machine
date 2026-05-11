/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkArchitecture } from './NeuralNetworkArchitecture';
import type { NeuralNetworkModelLearningSettings } from './NeuralNetworkModelBaseSettings';
import type { NeuralNetworkModelSettings } from './NeuralNetworkLearningSettings';
import type { NeuralNetworkTrainingObserver } from './NeuralNetworkTrainingObserver';

export class NeuralNetworkSettingsImpl implements NeuralNetworkModelSettings {
  public constructor(
    private learningSettings: NeuralNetworkModelLearningSettings,
    private networkArchitecture: NeuralNetworkArchitecture,
    private networkObserver: NeuralNetworkTrainingObserver,
  ) {}

  public setTrainingObserver(observer: NeuralNetworkTrainingObserver): void {
    this.networkObserver = observer;
  }

  public setLearningRate(learningRate: number): void {
    this.learningSettings.setLearningRate(learningRate);
  }

  public setNumberOfEpochs(numberOfEpochs: number): void {
    this.learningSettings.setNumberOfEpochs(numberOfEpochs);
  }

  public setBatchSize(batchSize: number): void {
    this.learningSettings.setBatchSize(batchSize);
  }

  public setValidationSplit(validationSplit: number): void {
    this.learningSettings.setValidationSplit(validationSplit);
  }

  public getArchitecture(): NeuralNetworkArchitecture {
    return this.networkArchitecture;
  }
  public getTrainingObserver(): NeuralNetworkTrainingObserver {
    return this.networkObserver;
  }
  public getLearningSettings(): NeuralNetworkModelLearningSettings {
    return this.learningSettings;
  }
  public getLearningRate(): number {
    return this.learningSettings.getLearningRate();
  }
  public getNumberOfEpochs(): number {
    return this.learningSettings.getNumberOfEpochs();
  }
  public getBatchSize(): number {
    return this.learningSettings.getBatchSize();
  }
  public getValidationSplit(): number {
    return this.learningSettings.getValidationSplit();
  }
}
