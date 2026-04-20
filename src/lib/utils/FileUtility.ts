/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { getControllers } from '../../backend/interface-adapter/MLMachine';
import type { NewGesture } from '../../core/entities/NewGesture';
import { GestureSerializer } from '../../core/serialization/gesture/GestureSerializer';

class FileUtility {
  public static loadDatasetFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (!e.target) {
        return;
      }
      const contents = e.target.result;
      if (typeof contents === 'string') {
        getControllers().getGestureController().importFromJson(contents);
      }
    };
    reader.readAsText(file as Blob);
  }

  public static downloadDataset(gestureData: NewGesture[]) {
    const serializer = new GestureSerializer();
    const serialized = gestureData.map(gest => serializer.serialize(gest));
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(serialized, null, 2)),
    );
    element.setAttribute('download', 'dataset');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }

  /**
   * Download arbitrary text content as a file. Ensures a .hex extension when
   * the provided filename does not already have one.
   */
  public static downloadFile(content: string, filename: string) {
    const baseName = (filename || 'download').trim();
    const finalName = baseName.toLowerCase().endsWith('.hex')
      ? baseName
      : `${baseName}.hex`;

    const blob = new Blob([content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalName;

    // Some browsers require the anchor to be in the document
    a.style.display = 'none';
    document.body.appendChild(a);

    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  }
}

export default FileUtility;
