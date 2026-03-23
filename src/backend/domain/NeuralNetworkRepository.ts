import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkModelSettings';

export interface NeuralNetworkRepository {
  getNeuralNetworkSettings(): NeuralNetworkModelSettings;
  setNeuralNetworkSettings(settings: NeuralNetworkModelSettings): void;
}
