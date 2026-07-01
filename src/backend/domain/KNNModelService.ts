import type { LabelledPoint } from '../../core/model/KNN/LabelledPoint';

export interface KNNModelService {
  getPoints(): LabelledPoint[];
}
