import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { NeuralNetworkRepository } from '../domain/NeuralNetworkRepository';
import type { AbstractState } from '../statemanagement/AbstractState';
import { SvelteStateAdapter } from '../statemanagement/SvelteStateAdapter';

export class StatesNeuralNetworkSettingsRepository implements NeuralNetworkRepository {
  private neuralNetworkSettings: AbstractState<NeuralNetworkModelSettings>;

  public constructor(initialSettings: AbstractState<NeuralNetworkModelSettings>) {
    this.neuralNetworkSettings = initialSettings;
  }

  public getNeuralNetworkSettings(): NeuralNetworkModelSettings {
    return this.neuralNetworkSettings.get();
  }

  public setNeuralNetworkSettings(settings: NeuralNetworkModelSettings): void {
    this.neuralNetworkSettings.set(settings);
  }
}
