import type KNNMLModel from "../../core/model/KNN/KNNMLModel";
import type { KNNModelSettings } from "../../core/model/KNN/KNNModelSettings";
import type { ModelInfo } from "../../core/model/ModelInfo";
import type { ModelTraining } from "../../core/model/ModelTraining";
import type { NeuralNetworkModelSettings } from "../../core/model/neural-network/NeuralNetworkLearningSettings";
import type { NeuralNetworkModel } from "../../core/model/neural-network/NeuralNetworkModel";

export interface ModelService {
    setLearningRate(learningRate: number): void;
    setEpochs(epochs: number): void;
    setBatchSize(batchSize: number): void;
    trainKNNModel(): Promise<KNNMLModel>
    trainNeuralNetworkModel(): Promise<NeuralNetworkModel>
    getModelTraining(): ModelTraining;
    setModelTraining(modelTraining: ModelTraining): void;
    getNeuralNetworkSettings(): NeuralNetworkModelSettings
    setNeuralNetworkSettings(neuralNetworkSettings: NeuralNetworkModelSettings): void;
    getKNNModelSettings(): KNNModelSettings;
    setNeuralNetworkOutputNodeCount(gestureCount: number): void;
    setNeuralNetworkInputNodeCount(filterCount: number, axesCount: number): void;
    setSelectedModel(model: ModelInfo): void;
    getSelectedModel(): ModelInfo;
}