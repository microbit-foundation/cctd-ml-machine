/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Gesture, GestureID } from '../../core/entities/Gesture';
import type { GestureOutput } from '../../core/entities/GestureOutput';
import type { RecordingData } from '../../core/entities/RecordingData';
import { type PersistedGestureData } from '../domain/stores/gesture/Gestures';
import { stores } from '../stores/Stores';

interface DownloadGesture {
  ID: GestureID,
  name: string,
  color: string,
  recordings: RecordingData[],
  output: GestureOutput,
}

class FileUtility {
  public static loadDatasetFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (!e.target) {
        return;
      }
      const contents = e.target.result;
      if (typeof contents === 'string') {
        stores.getGestures().importFrom(JSON.parse(contents) as PersistedGestureData[]);
      }
    };
    reader.readAsText(file as Blob);
  }

  public static downloadDataset(gestures: Gesture[]) {
    const element = document.createElement('a');
    const downloadable: DownloadGesture[] = gestures.map(gest => ({
      ID: gest.getID(),
      name: gest.getName(),
      color: gest.getColor(),
      output: gest.getOutput(),
      recordings: gest.getRecordings()
    }))
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(downloadable, null, 2)),
    );
    element.setAttribute('download', 'dataset');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }
}

export default FileUtility;
