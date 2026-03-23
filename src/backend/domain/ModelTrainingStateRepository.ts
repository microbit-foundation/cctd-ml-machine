import type { ModelTraining } from '../../core/model/ModelTraining';

export interface ModelTrainingStateRepository {
  getModelTraining(): ModelTraining;
  setModelTraining(modelTraining: ModelTraining): void;
}
