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
    private baseSettings: NeuralNetworkModelLearningSettings,
    private networkArchitecture: NeuralNetworkArchitecture,
    private networkObserver: NeuralNetworkTrainingObserver,
  ) {}
  public setLearningRate(learningRate: number): void {
    this.baseSettings.setLearningRate(learningRate);
  }

  public setNumberOfEpochs(numberOfEpochs: number): void {
    this.baseSettings.setNumberOfEpochs(numberOfEpochs);
  }

  public setBatchSize(batchSize: number): void {
    this.baseSettings.setBatchSize(batchSize);
  }

  public setValidationSplit(validationSplit: number): void {
    this.baseSettings.setValidationSplit(validationSplit);
  }

  public getArchitecture(): NeuralNetworkArchitecture {
    return this.networkArchitecture;
  }
  public getTrainingObserver(): NeuralNetworkTrainingObserver {
    return this.networkObserver;
  }
  public getLearningSettings(): NeuralNetworkModelLearningSettings {
    return this.baseSettings;
  }
  public getLearningRate(): number {
    return this.baseSettings.getLearningRate();
  }
  public getNumberOfEpochs(): number {
    return this.baseSettings.getNumberOfEpochs();
  }
  public getBatchSize(): number {
    return this.baseSettings.getBatchSize();
  }
  public getValidationSplit(): number {
    return this.baseSettings.getValidationSplit();
  }
}
