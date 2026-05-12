/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../../../core/classifier/Classifier';
import type { ModelTraining } from '../../../../core/model/ModelTraining';
import type { NeuralNetworkModelSettings } from '../../../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { ClassifierRepository } from '../../ClassifierRepository';
import type { ClassifierService } from '../../ClassifierService';
import type { ModelTrainingStateRepository } from '../../ModelTrainingStateRepository';
import type { NeuralNetworkRepository } from '../../NeuralNetworkRepository';
import { VectorClassifier } from '../../../../core/classifier/vector-classifier/VectorClassifier';
import { NeuralNetworkModelTrainer } from '../../../../core/model/neural-network/NeuralNetworkModelTrainer';
import type { DataService } from '../../DataService';
import { AccuracyClassifierEvaluator } from '../../../../core/classifier/evaluator/AccuracyClassifierEvaluator';
import { NeuralNetworkTrainingLossObserver } from './NeuralNetworkTrainingLossObserver';
import type { NerualNetworkTrainingIterationRepository } from '../../NerualNetworkTrainingIterationRepository';
import type { KNNSettingsService } from '../../KNNSettingsService';
import KNNModelTrainer from '../../../../core/model/KNN/KNNModelTrainer';
import type { ModelInfo } from '../../../../core/model/ModelInfo';
import type { FilterRepository } from '../../FilterRepository';
import { BasicNeuralNetworkArchitecture } from '../../../../core/model/neural-network/BasicNeuralNetworkArchitecture';
import { NeuralNetworkSettingsImpl } from '../../../../core/model/neural-network/NeuralNetworkSettingsImpl';

export class ClassifierServiceImpl implements ClassifierService {
  constructor(
    private classifierRepository: ClassifierRepository,
    private modelTraining: ModelTrainingStateRepository,
    private neuralNetworkRepository: NeuralNetworkRepository,
    private dataService: DataService,
    private knnSettingsService: KNNSettingsService,
    private trainingIterationRepository: NerualNetworkTrainingIterationRepository,
    private filterRepository: FilterRepository,
  ) {}

  public setSelectedModel(model: ModelInfo): void {
    this.classifierRepository.setSelectedModel(model);
  }

  public getSelectedModel(): ModelInfo {
    return this.classifierRepository.getSelectedModel();
  }

  public async trainKNNModel(): Promise<void> {
    const knnSettings = this.knnSettingsService.getKNNModelSettings();
    const trainer = new KNNModelTrainer(knnSettings);
    const trainingResult = await trainer.trainModel(
      this.dataService.getTrainingDataset(),
    );
    const model = trainingResult.model;
    const evaluator = new AccuracyClassifierEvaluator();
    const classifier = new VectorClassifier(model, evaluator);
    this.classifierRepository.setClassifier(classifier);
  }

  public async trainNeuralNetworkModel(): Promise<void> {
    this.trainingIterationRepository.clear();
    const settings = this.getNeuralNetworkSettings();
    settings.setTrainingObserver(
      new NeuralNetworkTrainingLossObserver(this.trainingIterationRepository),
    );
    const modelTrainer = new NeuralNetworkModelTrainer(settings);
    const trainingResult = await modelTrainer.trainModel(
      this.dataService.getTrainingDataset(),
    );
    const model = trainingResult.model;
    const evaluator = new AccuracyClassifierEvaluator();
    const classifier = new VectorClassifier(model, evaluator);

    this.classifierRepository.setClassifier(classifier);
  }

  public setNeuralNetworkSettings(
    neuralNetworkSettings: NeuralNetworkModelSettings,
  ): void {
    this.neuralNetworkRepository.setNeuralNetworkSettings(neuralNetworkSettings);
  }

  public unsetClassifier(): void {
    this.classifierRepository.setClassifier(undefined);
  }

  public getModelTraining(): ModelTraining {
    return this.modelTraining.getModelTraining();
  }

  public getClassifier(): Classifier | undefined {
    return this.classifierRepository.getClassifier();
  }

  public getNeuralNetworkSettings(): NeuralNetworkModelSettings {
    return this.neuralNetworkRepository.getNeuralNetworkSettings();
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
}
