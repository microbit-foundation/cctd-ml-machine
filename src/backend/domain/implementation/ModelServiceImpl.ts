import type KNNMLModel from "../../../core/model/KNN/KNNMLModel";
import type { KNNModelSettings } from "../../../core/model/KNN/KNNModelSettings";
import KNNModelTrainer from "../../../core/model/KNN/KNNModelTrainer";
import type { ModelInfo } from "../../../core/model/ModelInfo";
import type { ModelTraining } from "../../../core/model/ModelTraining";
import { BasicNeuralNetworkArchitecture } from "../../../core/model/neural-network/BasicNeuralNetworkArchitecture";
import type { NeuralNetworkModelSettings } from "../../../core/model/neural-network/NeuralNetworkLearningSettings";
import type { NeuralNetworkModel } from "../../../core/model/neural-network/NeuralNetworkModel";
import { NeuralNetworkModelTrainer } from "../../../core/model/neural-network/NeuralNetworkModelTrainer";
import { NeuralNetworkSettingsImpl } from "../../../core/model/neural-network/NeuralNetworkSettingsImpl";
import type { DataService } from "../DataService";
import type { KNNSettingsService } from "../KNNSettingsService";
import type { ModelRepository } from "../ModelRepository";
import type { ModelService } from "../ModelService";
import type { ModelTrainingStateRepository } from "../ModelTrainingStateRepository";
import type { NerualNetworkTrainingIterationRepository } from "../NerualNetworkTrainingIterationRepository";
import type { NeuralNetworkRepository } from "../NeuralNetworkRepository";
import { NeuralNetworkTrainingLossObserver } from "./classifier/NeuralNetworkTrainingLossObserver";

export class ModelServiceImpl implements ModelService {

    constructor(
        private knnSettingsService: KNNSettingsService,
        private dataService: DataService,
        private modelTrainingRepository: ModelTrainingStateRepository,
        private trainingIterationRepository: NerualNetworkTrainingIterationRepository,
        private neuralNetworkRepository: NeuralNetworkRepository,
        private modelRepository: ModelRepository,
    ) {
    }

    setNeuralNetworkSettings(neuralNetworkSettings: NeuralNetworkModelSettings): void {
        this.neuralNetworkRepository.setNeuralNetworkSettings(neuralNetworkSettings);
    }

    public async trainKNNModel(): Promise<KNNMLModel> {
        this.setModelIsTraining(true);
        const knnSettings = this.knnSettingsService.getKNNModelSettings();
        const trainer = new KNNModelTrainer(knnSettings);
        const trainingResult = await trainer.trainModel(
            this.dataService.getTrainingDataset(),
        );
        const model = trainingResult.model;
        this.setModelIsTraining(false);
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
            this.dataService.getTrainingDataset(),
        );
        const model = trainingResult.model;
        this.setModelIsTraining(false);
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
        this.modelTrainingRepository.setModelTraining(modelTraining);
    }

    public getModelTraining(): ModelTraining {
        return this.modelTrainingRepository.getModelTraining();
    }

    public setSelectedModel(model: ModelInfo): void {
        this.modelRepository.setSelectedModel(model);
    }

    public getSelectedModel(): ModelInfo {
        return this.modelRepository.getSelectedModel();
    }
}