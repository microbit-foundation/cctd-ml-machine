import type { ModelTraining } from '../../core/model/ModelTraining';

export interface ModelTrainingStateRepository {
  getModelTraining(): ModelTraining;
  saveModelTraining(modelTraining: ModelTraining): void;
}
