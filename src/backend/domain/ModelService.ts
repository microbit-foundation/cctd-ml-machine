import type KNNMLModel from "../../core/model/KNN/KNNMLModel";
import type { KNNModelSettings } from "../../core/model/KNN/KNNModelSettings";
import type { ModelInfo } from "../../core/model/ModelInfo";
import type { ModelTraining } from "../../core/model/ModelTraining";
import type { NeuralNetworkModel } from "../../core/model/neural-network/NeuralNetworkModel";

export interface ModelService {
    trainKNNModel(): Promise<KNNMLModel>
    trainNeuralNetworkModel(): Promise<NeuralNetworkModel>
    getModelTraining(): ModelTraining;
    setModelTraining(modelTraining: ModelTraining): void;
    getKNNModelSettings(): KNNModelSettings;
    setNeuralNetworkOutputNodeCount(gestureCount: number): void;
    setNeuralNetworkInputNodeCount(filterCount: number, axesCount: number): void;
    setSelectedModel(model: ModelInfo): void;
    getSelectedModel(): ModelInfo;
}