/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import { locale } from 'svelte-i18n';
import type { RecordingData } from '../../lib/domain/RecordingData';
import Gesture from '../../lib/domain/stores/gesture/Gesture';
import type { PersistedGestureData } from '../../lib/domain/stores/gesture/Gestures';
import type GestureConfidence from '../../lib/domain/stores/gesture/GestureConfidence';
import {
  serializeGestureRecordingsToCSV,
  serializeRecordingToCsvWithoutGestureName,
} from '../../lib/utils/CSVUtils';

describe('CSV Test', () => {
  // A crude way to enforce direction of dependencies, inspired by ArchUnit for java
  test('Convert recording', () => {
    const input: RecordingData = {
      ID: 123,
      labels: ['x', 'y', 'z'],
      samples: [
        {
          vector: [1, 2, 3],
        },
        {
          vector: [4, 5, 6],
        },
        {
          vector: [7, 8, 9],
        },
      ],
    };
    const data = writable({
      recordings: [input],
      name: 'Test;Gesture',
    } as PersistedGestureData);
    const confidence = writable({}) as unknown as GestureConfidence;
    const gesture: Gesture = new Gesture(data, confidence, () => void 0);
    const result = serializeGestureRecordingsToCSV([gesture]);
    expect(result).toBe(
      'gesture;sample;x;y;z\nTest\\;Gesture;0;1;2;3\nTest\\;Gesture;1;4;5;6\nTest\\;Gesture;2;7;8;9',
    );
  });

  test('Convert multiple gestures', () => {
    const input1: RecordingData = {
      ID: 123,
      labels: ['x', 'y', 'z'],
      samples: [
        {
          vector: [1, 2, 3],
        },
        {
          vector: [4, 5, 6],
        },
      ],
    };
    const input2: RecordingData = {
      ID: 456,
      labels: ['x', 'y', 'z'],
      samples: [
        {
          vector: [7, 8, 9],
        },
        {
          vector: [10, 11, 12],
        },
      ],
    };
    const data1 = writable({
      recordings: [input1],
      name: 'Gesture1',
    } as PersistedGestureData);
    const data2 = writable({
      recordings: [input2],
      name: 'Gesture2',
    } as PersistedGestureData);
    const confidence = writable({}) as unknown as GestureConfidence;
    const gesture1: Gesture = new Gesture(data1, confidence, () => void 0);
    const gesture2: Gesture = new Gesture(data2, confidence, () => void 0);
    const result = serializeGestureRecordingsToCSV([gesture1, gesture2]);
    expect(result).toBe(
      'gesture;sample;x;y;z\n' +
        'Gesture1;0;1;2;3\n' +
        'Gesture1;1;4;5;6\n' +
        'Gesture2;0;7;8;9\n' +
        'Gesture2;1;10;11;12',
    );
  });

  test('Serialize recording without gesture name (with headers)', () => {
    const input: RecordingData = {
      ID: 123,
      labels: ['x', 'y', 'z'],
      samples: [
        {
          vector: [1, 2, 3],
        },
        {
          vector: [4, 5, 6],
        },
        {
          vector: [7, 8, 9],
        },
      ],
    };

    const result = serializeRecordingToCsvWithoutGestureName(input);
    expect(result).toBe('sample;x;y;z\n' + '0;1;2;3\n' + '1;4;5;6\n' + '2;7;8;9');
  });

  describe('Locale-specific decimal formatting', () => {
    // Helper function to create test data with decimal numbers
    const createTestRecordingWithDecimals = (): RecordingData => ({
      ID: 123,
      labels: ['x', 'y', 'z'],
      samples: [
        {
          vector: [1.23, 4.56, 7.89],
        },
        {
          vector: [10.1, 20.2, 30.3],
        },
        {
          vector: [0.001, 999.999, -5.5],
        },
      ],
    });

    const createTestGestureWithDecimals = (name: string): Gesture => {
      const data = writable({
        recordings: [createTestRecordingWithDecimals()],
        name,
      } as PersistedGestureData);
      const confidence = writable({}) as unknown as GestureConfidence;
      return new Gesture(data, confidence, () => void 0);
    };

    test('English locale uses period as decimal separator', () => {
      // Set English locale
      locale.set('en');

      const gesture = createTestGestureWithDecimals('TestGesture');
      const result = serializeGestureRecordingsToCSV([gesture]);

      expect(result).toContain('1.23;4.56;7.89');
      expect(result).toContain('10.1;20.2;30.3');
      expect(result).toContain('0.001;999.999;-5.5');
      expect(result).not.toContain(','); // Should not contain commas
    });

    test('German locale uses comma as decimal separator', () => {
      // Set German locale
      locale.set('de');

      const gesture = createTestGestureWithDecimals('TestGesture');
      const result = serializeGestureRecordingsToCSV([gesture]);

      expect(result).toContain('1,23;4,56;7,89');
      expect(result).toContain('10,1;20,2;30,3');
      expect(result).toContain('0,001;999,999;-5,5');
      expect(result).not.toContain('1.23'); // Should not contain periods in numbers
    });

    test('Danish locale uses comma as decimal separator', () => {
      // Set Danish locale
      locale.set('da');

      const gesture = createTestGestureWithDecimals('TestGesture');
      const result = serializeGestureRecordingsToCSV([gesture]);

      expect(result).toContain('1,23;4,56;7,89');
      expect(result).toContain('10,1;20,2;30,3');
      expect(result).toContain('0,001;999,999;-5,5');
      expect(result).not.toContain('1.23'); // Should not contain periods in numbers
    });

    test('Unknown locale defaults to English format', () => {
      // Set unknown locale
      locale.set('fr'); // French is not supported, should default to English

      const gesture = createTestGestureWithDecimals('TestGesture');
      const result = serializeGestureRecordingsToCSV([gesture]);

      expect(result).toContain('1.23;4.56;7.89');
      expect(result).toContain('10.1;20.2;30.3');
      expect(result).toContain('0.001;999.999;-5.5');
      expect(result).not.toContain(','); // Should not contain commas
    });

    test('serializeRecordingToCsvWithoutGestureName uses locale-specific formatting', () => {
      const input = createTestRecordingWithDecimals();

      // Test English
      locale.set('en');
      const englishResult = serializeRecordingToCsvWithoutGestureName(input);
      expect(englishResult).toContain('0;1.23;4.56;7.89');
      expect(englishResult).toContain('1;10.1;20.2;30.3');

      // Test German
      locale.set('de');
      const germanResult = serializeRecordingToCsvWithoutGestureName(input);
      expect(germanResult).toContain('0;1,23;4,56;7,89');
      expect(germanResult).toContain('1;10,1;20,2;30,3');

      // Test Danish
      locale.set('da');
      const danishResult = serializeRecordingToCsvWithoutGestureName(input);
      expect(danishResult).toContain('0;1,23;4,56;7,89');
      expect(danishResult).toContain('1;10,1;20,2;30,3');
    });

    test('Integer values are not affected by locale formatting', () => {
      const integerInput: RecordingData = {
        ID: 123,
        labels: ['x', 'y', 'z'],
        samples: [
          {
            vector: [1, 2, 3],
          },
          {
            vector: [10, 20, 30],
          },
        ],
      };

      // Test with German locale (comma separator)
      locale.set('de');
      const result = serializeRecordingToCsvWithoutGestureName(integerInput);

      // Integer values should remain unchanged
      expect(result).toContain('0;1;2;3');
      expect(result).toContain('1;10;20;30');
      expect(result).not.toContain(','); // No commas should appear for integers
    });

    test('Negative numbers are formatted correctly with locale', () => {
      const negativeInput: RecordingData = {
        ID: 123,
        labels: ['x', 'y', 'z'],
        samples: [
          {
            vector: [-1.5, -2.75, -3.125],
          },
        ],
      };

      // Test English
      locale.set('en');
      const englishResult = serializeRecordingToCsvWithoutGestureName(negativeInput);
      expect(englishResult).toContain('0;-1.5;-2.75;-3.125');

      // Test German
      locale.set('de');
      const germanResult = serializeRecordingToCsvWithoutGestureName(negativeInput);
      expect(germanResult).toContain('0;-1,5;-2,75;-3,125');
    });

    test('Large numbers (>1000) are formatted without thousands separator', () => {
      const largeInput: RecordingData = {
        ID: 999,
        labels: ['x', 'y', 'z'],
        samples: [
          {
            vector: [1000.5, 1234.56, 1000000.001],
          },
        ],
      };

      // English: period as decimal separator, no thousands separator
      locale.set('en');
      const enResult = serializeRecordingToCsvWithoutGestureName(largeInput);
      expect(enResult).toContain('0;1000.5;1234.56;1000000.001');
      // Ensure no thousands separators like '1,234' or '1.234' or spaces
      expect(enResult).not.toContain('1,234');
      expect(enResult).not.toContain('1.234');
      expect(enResult).not.toContain('1 234');

      // German: comma as decimal separator, no thousands separator
      locale.set('de');
      const deResult = serializeRecordingToCsvWithoutGestureName(largeInput);
      expect(deResult).toContain('0;1000,5;1234,56;1000000,001');
      expect(deResult).not.toContain('1.234');
      expect(deResult).not.toContain('1,234');
      expect(deResult).not.toContain('1 234');

      // Danish: comma as decimal separator, no thousands separator
      locale.set('da');
      const daResult = serializeRecordingToCsvWithoutGestureName(largeInput);
      expect(daResult).toContain('0;1000,5;1234,56;1000000,001');
      expect(daResult).not.toContain('1.234');
      expect(daResult).not.toContain('1,234');
      expect(daResult).not.toContain('1 234');
    });

    // Reset locale after tests to avoid affecting other tests
    afterEach(() => {
      locale.set('en');
    });
  });
});
