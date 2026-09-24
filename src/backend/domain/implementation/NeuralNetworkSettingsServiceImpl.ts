/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { ModelOption } from '../../../core/model/ModelOption';
import { ModelOptions } from '../../../core/model/ModelOptions';
import { BasicNeuralNetworkArchitecture } from '../../../core/model/neural-network/BasicNeuralNetworkArchitecture';
import type { NeuralNetworkArchitecture } from '../../../core/model/neural-network/NeuralNetworkArchitecture';
import type { NeuralNetworkModelSettings } from '../../../core/model/neural-network/NeuralNetworkLearningSettings';
import { NeuralNetworkSettingsImpl } from '../../../core/model/neural-network/NeuralNetworkSettingsImpl';
import { SettingsChange } from '../../../core/model/SettingsChange';
import type { ModelTrainingStateRepository } from '../ModelTrainingStateRepository';
import type { NeuralNetworkRepository } from '../NeuralNetworkRepository';
import type { NeuralNetworkSettingsService } from '../NeuralNetworkSettingsService';

export class NeuralNetworkSettingsServiceImpl implements NeuralNetworkSettingsService {
  constructor(
    private neuralNetworkRepository: NeuralNetworkRepository,
    private modelTrainingRepository: ModelTrainingStateRepository,
  ) {}

  setNumberOfUnits(units: number): void {
    const currentSettings = this.getNeuralNetworkSettings();
    const noOfClasses = currentSettings
      .getArchitecture()
      .getOutputLayer()
      .getNumberOfNodes();
    const totalInputNodes = currentSettings
      .getArchitecture()
      .getInputLayer()
      .getNumberOfNodes();
    const newArchitecture = new BasicNeuralNetworkArchitecture(
      noOfClasses,
      totalInputNodes,
      units,
    );
    this.setNeuralNetworkArchitecture(newArchitecture);
  }

  setEpochs(epochs: number): void {
    const settings = this.getNeuralNetworkSettings();
    const prevEpochs = settings.getLearningSettings().getNumberOfEpochs();
    settings.getLearningSettings().setNumberOfEpochs(epochs);
    this.setNeuralNetworkSettings(
      settings,
      new SettingsChange(new ModelOption(ModelOptions.EPOCHS), prevEpochs, epochs),
    );
  }

  setBatchSize(batchSize: number): void {
    const settings = this.getNeuralNetworkSettings();
    const prevBatchSize = settings.getLearningSettings().getBatchSize();
    settings.getLearningSettings().setBatchSize(batchSize);
    this.setNeuralNetworkSettings(
      settings,
      new SettingsChange(
        new ModelOption(ModelOptions.BATCH_SIZE),
        prevBatchSize,
        batchSize,
      ),
    );
  }

  setLearningRate(learningRate: number): void {
    const settings = this.getNeuralNetworkSettings();
    const prevLearnRate = settings.getLearningSettings().getLearningRate();
    settings.getLearningSettings().setLearningRate(learningRate);
    this.setNeuralNetworkSettings(
      settings,
      new SettingsChange(
        new ModelOption(ModelOptions.LEARNING_RATE),
        prevLearnRate,
        learningRate,
      ),
    );
  }

  getNeuralNetworkSettings(): NeuralNetworkModelSettings {
    return this.neuralNetworkRepository.getNeuralNetworkSettings();
  }

  private setNeuralNetworkSettings<T>(
    neuralNetworkSettings: NeuralNetworkModelSettings,
    settingsChange: SettingsChange<T>,
  ) {
    const training = this.modelTrainingRepository.getModelTraining();
    training.addPendingSetting(settingsChange);
    this.modelTrainingRepository.saveModelTraining(training);
    this.neuralNetworkRepository.setNeuralNetworkSettings(neuralNetworkSettings);
  }

  private setNeuralNetworkArchitecture(architecture: NeuralNetworkArchitecture): void {
    const settings = this.getNeuralNetworkSettings();
    const prevArchitecture = settings.getArchitecture();
    const newSettings = new NeuralNetworkSettingsImpl(
      settings.getLearningSettings(),
      architecture,
      settings.getTrainingObserver(),
    );
    this.setNeuralNetworkSettings(
      newSettings,
      new SettingsChange(
        new ModelOption(ModelOptions.ARCHITECTURE),
        prevArchitecture,
        architecture,
      ),
    );
  }
}
