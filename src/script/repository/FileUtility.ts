/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { GestureData } from '../domain/stores/gesture/Gesture';
import { PersistantGestureData } from '../domain/stores/gesture/Gestures';
import { gestures } from '../stores/Stores';

class FileUtility {
  public static loadDatasetFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (!e.target) {
        return;
      }
      const contents = e.target.result;
      if (typeof contents === 'string') {
        gestures.importFrom(JSON.parse(contents) as PersistantGestureData[]);
      }
    };
    reader.readAsText(file as Blob);
  }

  public static downloadDataset(gestureData: GestureData[]) {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(gestureData, null, 2)),
    );
    element.setAttribute('download', 'dataset');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }
}

export default FileUtility;
