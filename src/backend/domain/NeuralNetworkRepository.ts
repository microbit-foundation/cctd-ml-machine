import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';

export interface NeuralNetworkRepository {
  getNeuralNetworkSettings(): NeuralNetworkModelSettings;
  setNeuralNetworkSettings(settings: NeuralNetworkModelSettings): void;
}
