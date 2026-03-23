import type { Classifier } from '../../core/classifier/Classifier';

export interface ClassifierRepository {
  getClassifier(): Classifier | undefined;
  setClassifier(classifier: Classifier | undefined): void;
}
