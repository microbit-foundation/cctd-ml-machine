/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import exampleDataset from '../../assets/exampleDataset.json';
import { t } from '../../i18n';
import { derived, get } from 'svelte/store';
import FileUtility from '../../lib/utils/FileUtility';
import { getControllers } from '../../backend/interface-adapter/MLMachine';
import type { NewGesture } from '../../core/entities/NewGesture';

export const downloadDataset = () => {
  const gestureController = getControllers().getGestureController();
  const gesturesJson = gestureController.getDownloadableGesturesAsJson();
  FileUtility.downloadFile(gesturesJson, 'dataset.json');
};

export const importExampleDataset = () => {
  // TODO: Move this to the gesture controller instead!
  const gestureController = getControllers().getGestureController();
  getControllers().getGestureController().importFromJson(exampleDataset.toString())

  // Translate the names, that are originally english
  const gestures = get(gestureController.getGestures());
  gestureController.setGestureName(gestures[0].getID(), (get(t)('content.data.noData.exampleName.shake')));
  gestureController.setGestureName(gestures[1].getID(), (get(t)('content.data.noData.exampleName.still')));
  gestureController.setGestureName(gestures[2].getID(), (get(t)('content.data.noData.exampleName.circle')));
};

export const hasSomeRecordingData = derived(getControllers().getGestureController().getGestures(), gestures => {
  if (gestures.length === 0) {
    return false;
  }
  return gestures.some((gesture: NewGesture) => gesture.getRecordings().length > 0);
});
