import type { Classifier } from '../../core/classifier/Classifier';
import type { ClassifierRepository } from '../domain/ClassifierRepository';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesClassifierRepository implements ClassifierRepository {
  private classifier: AbstractState<Classifier | undefined>;

  public constructor(states: AbstractStates) {
    this.classifier = states.getClassifier();
  }

  public getClassifier(): Classifier | undefined {
    return this.classifier.get();
  }

  public setClassifier(classifier: Classifier | undefined): void {
    this.classifier.set(classifier);
  }
}
