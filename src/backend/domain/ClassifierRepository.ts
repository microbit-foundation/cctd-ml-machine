import type { Classifier } from '../../core/classifier/Classifier';
import type { ModelInfo } from '../../core/model/ModelInfo';

export interface ClassifierRepository {
  getSelectedModel(): ModelInfo;
  setSelectedModel(model: ModelInfo): void;
  getClassifier(): Classifier | undefined;
  setClassifier(classifier: Classifier | undefined): void;
}
