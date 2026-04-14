import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';
import type { KNNSettingsService } from '../domain/KNNSettingsService';
import type { AbstractReadonlyState } from '../statemanagement/AbstractReadonlyState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class KNNController {
  constructor(
    private states: AbstractStates,
    private knnSettingsService: KNNSettingsService,
  ) {}

  public getKNNModelSettings(): AbstractReadonlyState<KNNModelSettings> {
    return this.states.getKNNModelSettings();
  }

  public setK(k: number): void {
    this.knnSettingsService.setK(k);
  }

  public setNormalized(checked: any) {
    this.knnSettingsService.setNormalized(checked);
  }
}
