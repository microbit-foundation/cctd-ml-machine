/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ConsoleLogger from '../../../core/logging/ConsoleLogger';
import type KNNMLModel from '../../../core/model/KNN/KNNMLModel';
import type { KNNModelSettings } from '../../../core/model/KNN/KNNModelSettings';
import KNNModelTrainer from '../../../core/model/KNN/KNNModelTrainer';
import type { ModelInfo } from '../../../core/model/ModelInfo';
import { ModelOption } from '../../../core/model/ModelOption';
import type { ModelTraining } from '../../../core/model/ModelTraining';
import { BasicNeuralNetworkArchitecture } from '../../../core/model/neural-network/BasicNeuralNetworkArchitecture';
import type { NeuralNetworkModelSettings } from '../../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { NeuralNetworkModel } from '../../../core/model/neural-network/NeuralNetworkModel';
import { NeuralNetworkModelTrainer } from '../../../core/model/neural-network/NeuralNetworkModelTrainer';
import { NeuralNetworkSettingsImpl } from '../../../core/model/neural-network/NeuralNetworkSettingsImpl';
import { SettingsChange } from '../../../core/model/SettingsChange';
import type { DataService } from '../DataService';
import type { KNNPointsRepository } from '../KNNPointsRepository';
import type { KNNSettingsService } from '../KNNSettingsService';
import type { ModelRepository } from '../ModelRepository';
import type { ModelService } from '../ModelService';
import type { ModelTrainingStateRepository } from '../ModelTrainingStateRepository';
import type { NerualNetworkTrainingIterationRepository } from '../NerualNetworkTrainingIterationRepository';
import type { NeuralNetworkRepository } from '../NeuralNetworkRepository';
import { NeuralNetworkTrainingLossObserver } from './classifier/NeuralNetworkTrainingLossObserver';
import { KNNModelObserverImpl } from './KNNModelObserverImpl';

export class ModelServiceImpl implements ModelService {
  private log = new ConsoleLogger(ModelServiceImpl.name);

  constructor(
    private knnSettingsService: KNNSettingsService,
    private dataService: DataService,
    private modelTrainingRepository: ModelTrainingStateRepository,
    private trainingIterationRepository: NerualNetworkTrainingIterationRepository,
    private neuralNetworkRepository: NeuralNetworkRepository,
    private modelRepository: ModelRepository,
    private knnPointsRepository: KNNPointsRepository,
  ) {}

  setEpochs(epochs: number): void {
    const settings = this.getNeuralNetworkSettings();
    const training = this.getModelTraining();
    training.addPendingSetting(
      new SettingsChange(
        new ModelOption('Epochs'),
        settings.getLearningSettings().getNumberOfEpochs(),
        epochs,
      ),
    );
    this.modelTrainingRepository.saveModelTraining(training);
    settings.getLearningSettings().setNumberOfEpochs(epochs);
    this.setNeuralNetworkSettings(settings);
  }
  setBatchSize(batchSize: number): void {
    const settings = this.getNeuralNetworkSettings();
    const training = this.getModelTraining();
    training.addPendingSetting(
      new SettingsChange(
        new ModelOption('Batch Size'),
        settings.getLearningSettings().getBatchSize(),
        batchSize,
      ),
    );
    this.modelTrainingRepository.saveModelTraining(training);
    settings.getLearningSettings().setBatchSize(batchSize);
    this.setNeuralNetworkSettings(settings);
  }

  setLearningRate(learningRate: number): void {
    const settings = this.getNeuralNetworkSettings();
    const training = this.getModelTraining();
    training.addPendingSetting(
      new SettingsChange(
        new ModelOption('Learning Rate'),
        settings.getLearningSettings().getLearningRate(),
        learningRate,
      ),
    );
    this.modelTrainingRepository.saveModelTraining(training);
    settings.getLearningSettings().setLearningRate(learningRate);
    this.setNeuralNetworkSettings(settings);
  }

  setModelTraining(modelTraining: ModelTraining): void {
    this.modelTrainingRepository.saveModelTraining(modelTraining);
  }

  setNeuralNetworkSettings(neuralNetworkSettings: NeuralNetworkModelSettings): void {
    this.neuralNetworkRepository.setNeuralNetworkSettings(neuralNetworkSettings);
  }

  public async trainKNNModel(): Promise<KNNMLModel> {
    this.setModelIsTraining(true);
    const knnSettings = this.knnSettingsService.getKNNModelSettings();
    const observer = new KNNModelObserverImpl(this.knnPointsRepository);
    const trainer = new KNNModelTrainer(knnSettings, observer);
    const trainingResult = await trainer.trainModel(
      this.dataService.getTrainingDataset(knnSettings.shouldNormalize()),
    );
    const model = trainingResult.model;
    this.setModelIsTraining(false);
    this.clearPendingSettings();
    return model;
  }

  public setNeuralNetworkOutputNodeCount(gestureCount: number): void {
    const settings = this.getNeuralNetworkSettings();
    const newArchitecture = new BasicNeuralNetworkArchitecture(
      gestureCount,
      settings.getArchitecture().getInputLayer().getNumberOfNodes(),
      settings.getArchitecture().getHiddenLayers()[0].getNumberOfNodes(),
    );
    const newSettings = new NeuralNetworkSettingsImpl(
      settings.getLearningSettings(),
      newArchitecture,
      settings.getTrainingObserver(),
    );
    this.setNeuralNetworkSettings(newSettings);
  }

  public setNeuralNetworkInputNodeCount(filterCount: number, axesCount: number): void {
    const settings = this.getNeuralNetworkSettings();
    const newArchitecture = new BasicNeuralNetworkArchitecture(
      settings.getArchitecture().getOutputLayer().getNumberOfNodes(),
      filterCount * axesCount,
      settings.getArchitecture().getHiddenLayers()[0].getNumberOfNodes(),
    );
    const newSettings = new NeuralNetworkSettingsImpl(
      settings.getLearningSettings(),
      newArchitecture,
      settings.getTrainingObserver(),
    );
    this.setNeuralNetworkSettings(newSettings);
  }

  public async trainNeuralNetworkModel(): Promise<NeuralNetworkModel> {
    this.setModelIsTraining(true);
    this.trainingIterationRepository.clear();
    const settings = this.getNeuralNetworkSettings();
    settings.setTrainingObserver(
      new NeuralNetworkTrainingLossObserver(this.trainingIterationRepository),
    );
    const modelTrainer = new NeuralNetworkModelTrainer(settings);
    const trainingResult = await modelTrainer.trainModel(
      this.dataService.getTrainingDataset(settings.shouldNormalize()),
    );
    const model = trainingResult.model;
    this.setModelIsTraining(false);
    this.clearPendingSettings();
    return model;
  }

  getKNNModelSettings(): KNNModelSettings {
    return this.knnSettingsService.getKNNModelSettings();
  }

  getNeuralNetworkSettings(): NeuralNetworkModelSettings {
    return this.neuralNetworkRepository.getNeuralNetworkSettings();
  }

  private setModelIsTraining(isTraining: boolean): void {
    const modelTraining = this.getModelTraining();
    modelTraining.setIsTraining(isTraining);
    this.modelTrainingRepository.saveModelTraining(modelTraining);
  }

  private clearPendingSettings(): void {
    this.log.info('Clearing pending settings');
    const modelTraining = this.getModelTraining();
    modelTraining.clearPendingSettings();
    this.modelTrainingRepository.saveModelTraining(modelTraining);
  }

  public getModelTraining(): ModelTraining {
    return this.modelTrainingRepository.getModelTraining();
  }

  public setSelectedModel(model: ModelInfo): void {
    if (this.modelRepository.getSelectedModel()?.getType() === model.getType()) {
      return;
    }
    this.log.info('Changing selected model to', model.getTitle());
    this.modelRepository.setSelectedModel(model);
    const training = this.getModelTraining();
    training.addPendingSetting(
      new SettingsChange(
        new ModelOption('Selected Model'),
        this.modelRepository.getSelectedModel(),
        model,
      ),
    );
    this.modelTrainingRepository.saveModelTraining(training);
  }

  public getSelectedModel(): ModelInfo {
    return this.modelRepository.getSelectedModel();
  }
}
