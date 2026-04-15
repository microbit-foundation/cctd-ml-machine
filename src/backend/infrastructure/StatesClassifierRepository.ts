import type { Classifier } from '../../core/classifier/Classifier';
import type { ModelInfo } from '../../core/model/ModelInfo';
import type { ClassifierRepository } from '../domain/ClassifierRepository';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesClassifierRepository implements ClassifierRepository {
  private classifier: AbstractState<Classifier | undefined>;
  private selectedModel: AbstractState<ModelInfo>;

  public constructor(states: AbstractStates) {
    this.classifier = states.getClassifier();
    this.selectedModel = states.getSelectedModel();
  }

  public getSelectedModel(): ModelInfo {
    return this.selectedModel.get();
  }

  public setSelectedModel(model: ModelInfo): void {
    this.selectedModel.set(model);
  }

  public getClassifier(): Classifier | undefined {
    return this.classifier.get();
  }

  public setClassifier(classifier: Classifier | undefined): void {
    this.classifier.set(classifier);
  }
}
