/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type GestureData } from '../domain/stores/gesture/GestureState';
import { type PersistedGestureData } from '../domain/stores/gesture/Gestures';
import { stores } from '../stores/Stores';
import type {
  PersistedValidationSet,
  ValidationSetImportResult,
} from '../domain/stores/ValidationSets';

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

  public static loadValidationSetsFromFile(
    file: File,
    onLoaded?: (result: ValidationSetImportResult) => void,
    onError?: (error: unknown) => void,
  ) {
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      const contents = e.target?.result;
      if (typeof contents !== 'string') {
        return;
      }
      try {
        const result = stores
          .getValidationSets()
          .importFrom(JSON.parse(contents) as PersistedValidationSet[]);
        onLoaded?.(result);
      } catch (error) {
        onError?.(error);
      }
    };
    reader.readAsText(file as Blob);
  }

  public static downloadValidationSets(validationSets: PersistedValidationSet[]) {
    FileUtility.downloadJson(validationSets, 'validation-sets');
  }

  public static downloadDataset(gestureData: GestureData[]) {
    FileUtility.downloadJson(gestureData, 'dataset');
  }

  private static downloadJson(data: unknown, filename: string) {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(data, null, 2)),
    );
    element.setAttribute('download', filename);

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
