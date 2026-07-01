import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';
import type { LabelledPoint } from '../../core/model/KNN/LabelledPoint';
import type { Vector } from '../../core/vector/Vector';
import type { KNNModelService } from '../domain/KNNModelService';
import type { KNNSettingsService } from '../domain/KNNSettingsService';
import type { AbstractReadonlyState } from '../statemanagement/AbstractReadonlyState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class KNNController {
  constructor(
    private states: AbstractStates,
    private knnSettingsService: KNNSettingsService,
    private knnModelService: KNNModelService,
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

  public getKNNInput(): AbstractReadonlyState<Vector | undefined> {
    return this.states.getKNNInput();
  }

  public getKNNNearestNeighbours(): AbstractReadonlyState<LabelledPoint[]> {
    return this.states.getKNNNearestNeighbours();
  }

  public getKNNPoints(): LabelledPoint[] {
    return this.knnModelService.getPoints();
  }
}
