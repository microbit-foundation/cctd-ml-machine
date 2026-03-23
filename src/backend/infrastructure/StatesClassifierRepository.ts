import type { Classifier } from '../../core/classifier/Classifier';
import type { ClassifierRepository } from '../domain/ClassifierRepository';
import type { AbstractState } from '../statemanagement/AbstractState';

export class StatesClassifierRepository implements ClassifierRepository {
  private classifier: AbstractState<Classifier | undefined>;

  public constructor(initialClassifier: AbstractState<Classifier | undefined>) {
    this.classifier = initialClassifier;
  }

  public getClassifier(): Classifier | undefined {
    return this.classifier.get();
  }

  public setClassifier(classifier: Classifier | undefined): void {
    this.classifier.set(classifier);
  }
}
