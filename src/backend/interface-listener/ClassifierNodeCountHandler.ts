/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { GestureListListener } from '../domain/eventlistener/GestureListListener';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { ModelService } from '../domain/ModelService';
import type { KNNSettingsService } from '../domain/KNNSettingsService';

/**
 * ClassifierNodeCountHandler
 * Concrete listener that updates the classifier output node count when gestures change.
 */
export class ClassifierNodeCountHandler implements GestureListListener {
  private modelService?: ModelService;

  private knnSettingsService?: KNNSettingsService;

  setServices(modelService: ModelService, knnSettingsService: KNNSettingsService): void {
    this.modelService = modelService;
    this.knnSettingsService = knnSettingsService;
  }

  onGesturesChanged(gestures: NewGesture[]): void {
    if (this.modelService) {
      this.modelService.setNeuralNetworkOutputNodeCount(gestures.length);
    }
    if (this.knnSettingsService) {
      this.knnSettingsService.setNumberOfClasses(gestures.length);
    }
  }
}
