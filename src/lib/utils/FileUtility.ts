/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import MemoryMap from 'nrf-intel-hex';
import { type GestureData } from '../domain/stores/gesture/GestureState';
import { type PersistedGestureData } from '../domain/stores/gesture/Gestures';
import { stores } from '../stores/Stores';
import type { MBSpecs } from 'microbyte';
import { isUniversalHex, separateUniversalHex } from '@microbit/microbit-universal-hex';

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

  public static createHexBuffer(
    hexContent: string,
    mbVersion: MBSpecs.MBVersion,
  ): Uint8Array | ArrayBuffer {
    if (isUniversalHex(hexContent)) {
      const separated = separateUniversalHex(hexContent);
      const versionIds: Record<MBSpecs.MBVersion, number[]> = {
        '1': [0x9900, 0x9901],
        '2': [0x9903, 0x9904, 0x9905, 0x9906],
      };
      const versionedPart = separated.find(part =>
        versionIds[mbVersion].includes(part.boardId),
      );
      if (!versionedPart) {
        throw new Error(
          `No compatible hex part found for micro:bit version ${mbVersion}`,
        );
      }
      return (new TextEncoder().encode(versionedPart.hex).buffer as ArrayBuffer).slice(0);
    }
    return (new TextEncoder().encode(hexContent).buffer as ArrayBuffer).slice(0);
  }
}

export default FileUtility;
