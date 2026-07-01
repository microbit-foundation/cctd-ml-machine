import type { ModelInfo } from '../../core/model/ModelInfo';

export interface ModelRepository {
  getSelectedModel(): ModelInfo;
  setSelectedModel(model: ModelInfo): void;
}
