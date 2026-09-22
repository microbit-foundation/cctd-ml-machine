/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { RecordingData } from './domain/RecordingData';

export type ChartDataset = { x: number; y: number }[];
export const getRecordingChartDatasets = (
  recordingData: RecordingData['samples'],
): ChartDataset[] => {
  const numberOfAxes = recordingData.length > 0 ? recordingData[0].vector.length : 0;
  const datasets = [];
  for (let i = 0; i < numberOfAxes; i++) {
    const dataset: ChartDataset = [];
    recordingData.forEach((e, idx) => {
      dataset.push({
        x: idx,
        y: e.vector[i],
      });
    });
    datasets.push(dataset);
  }
  return datasets;
};
