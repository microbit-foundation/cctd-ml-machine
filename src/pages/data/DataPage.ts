/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { stores } from '../../lib/stores/Stores';
import exampleDataset from '../../assets/exampleDataset.json';
import { t } from '../../i18n';
import { derived, get } from 'svelte/store';
import type { GestureData } from '../../lib/domain/stores/gesture/GestureState';
import FileUtility from '../../lib/utils/FileUtility';
import { getControllers } from '../../backend/interface-adapter/MLMachine';

export const downloadDataset = () => {
  const gestureController = getControllers().getGestureController();
  const gesturesJson = gestureController.getDownloadableGesturesAsJson();
  FileUtility.downloadFile(gesturesJson, 'dataset.json');
};

export const importExampleDataset = () => {
  const gestures = stores.getGestures();
  const availableAxes = stores.getAvailableAxes();

  // Imports 3 gestures, named Shake, Still and Circle (in that order)
  gestures.importFrom(exampleDataset);
  // Translate the names, that are originally english
  gestures.getGestures()[0].setName(get(t)('content.data.noData.exampleName.shake'));
  gestures.getGestures()[1].setName(get(t)('content.data.noData.exampleName.still'));
  gestures.getGestures()[2].setName(get(t)('content.data.noData.exampleName.circle'));
  availableAxes.loadFromGestures();
};

export const hasSomeRecordingData = derived(stores.getGestures(), gestures => {
  if (gestures.length === 0) {
    return false;
  }
  return gestures.some((gesture: GestureData) => gesture.recordings.length > 0);
});
