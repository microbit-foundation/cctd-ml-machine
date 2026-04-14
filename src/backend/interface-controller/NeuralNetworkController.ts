import { BasicNeuralNetworkArchitecture } from '../../core/model/neural-network/BasicNeuralNetworkArchitecture';
import type { NeuralNetworkModelSettings } from '../../core/model/neural-network/NeuralNetworkLearningSettings';
import { NeuralNetworkSettingsImpl } from '../../core/model/neural-network/NeuralNetworkSettingsImpl';
import type { ClassifierService } from '../domain/ClassifierService';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class NeuralNetworkController {
  public setBatchSize(val: number): void {
    const currentSettings = this.states.getNeuralNetworkSettings().get();
    currentSettings.getLearningSettings().setBatchSize(val);
    this.setNeuralNetworkSettings(currentSettings);
  }
  public setNumberOfUnits(val: number): void {
    const currentSettings = this.states.getNeuralNetworkSettings().get();
    const noOfClasses = currentSettings
      .getArchitecture()
      .getOutputLayer()
      .getNumberOfNodes();
    const noOfFilters = currentSettings
      .getArchitecture()
      .getInputLayer()
      .getNumberOfNodes();
    const newArchitecture = new BasicNeuralNetworkArchitecture(
      noOfClasses,
      noOfFilters,
      val,
    );
    const newSettings = new NeuralNetworkSettingsImpl(
      currentSettings.getLearningSettings(),
      newArchitecture,
      currentSettings.getTrainingObserver(),
    );
    this.setNeuralNetworkSettings(newSettings);
  }

  public constructor(
    private states: AbstractStates,
    private classifierService: ClassifierService,
  ) {}

  public getNeuralNetworkSettings(): AbstractState<NeuralNetworkModelSettings> {
    return this.states.getNeuralNetworkSettings();
  }

  public setNeuralNetworkSettings(neuralNetworkSettings: NeuralNetworkModelSettings) {
    this.classifierService.setNeuralNetworkSettings(neuralNetworkSettings);
  }

  public setLearningRate(learningRate: number) {
    const currentSettings = this.states.getNeuralNetworkSettings().get();
    currentSettings.getLearningSettings().setLearningRate(learningRate);
    this.setNeuralNetworkSettings(currentSettings);
  }

  public setNumberOfEpochs(val: number): void {
    const currentSettings = this.states.getNeuralNetworkSettings().get();
    currentSettings.getLearningSettings().setNumberOfEpochs(val);
    this.setNeuralNetworkSettings(currentSettings);
  }
}
