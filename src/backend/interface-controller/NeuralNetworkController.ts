/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import type { NeuralNetworkTrainingIteration } from '../../core/model/neural-network/NeuralNetworkTrainingIteration';
import type { NeuralNetworkSettingsService } from '../domain/NeuralNetworkSettingsService';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class NeuralNetworkController {
  public constructor(
    private states: AbstractStates,
    private settingsService: NeuralNetworkSettingsService,
  ) {}

  public setBatchSize(val: number): void {
    this.settingsService.setBatchSize(val);
  }

  public setNumberOfUnits(val: number): void {
    this.settingsService.setNumberOfUnits(val);
  }

  public getTrainingIterations(): AbstractState<NeuralNetworkTrainingIteration[]> {
    return this.states.getNeuralNetworkTrainingIterations();
  }

  public getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings> {
    return this.states.getNeuralNetworkSettings();
  }

  public setLearningRate(learningRate: number) {
    this.settingsService.setLearningRate(learningRate);
  }

  public setNumberOfEpochs(val: number): void {
    this.settingsService.setEpochs(val);
  }
}
