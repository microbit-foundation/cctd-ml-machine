import type { GestureListListener } from '../domain/GestureListListener';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { ClassifierService } from '../domain/ClassifierService';

/**
 * ClassifierNodeCountHandler
 * Concrete listener that updates the classifier output node count when gestures change.
 */
export class ClassifierNodeCountHandler implements GestureListListener {
  private classifierService?: ClassifierService;

  setClassifierService(classifierService: ClassifierService) {
    this.classifierService = classifierService;
  }

  onGesturesChanged(gestures: NewGesture[]): void {
    if (this.classifierService) {
      this.classifierService.setNeuralNetworkOutputNodeCount(gestures.length);
    }
  }
}
