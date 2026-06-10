import type { GestureListListener } from '../domain/eventlistener/GestureListListener';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { ClassifierService } from '../domain/ClassifierService';
import type { ModelService } from '../domain/ModelService';

/**
 * ClassifierNodeCountHandler
 * Concrete listener that updates the classifier output node count when gestures change.
 */
export class ClassifierNodeCountHandler implements GestureListListener {
  private modelService?: ModelService;

  setModelService(modelService: ModelService) {
    this.modelService = modelService;
  }

  onGesturesChanged(gestures: NewGesture[]): void {
    if (this.modelService) {
      this.modelService.setNeuralNetworkOutputNodeCount(gestures.length);
    }
  }
}
