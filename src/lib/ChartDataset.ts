/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Sample } from '../core/entities/recording/Sample';

export type ChartDataset = { x: number; y: number }[];
export const getRecordingChartDatasets = (samples: Sample[]): ChartDataset[] => {
  const numberOfAxes = samples.length > 0 ? samples[0].getValue().length : 0;
  const datasets = [];
  for (let i = 0; i < numberOfAxes; i++) {
    const dataset: ChartDataset = [];
    samples.forEach((e, idx) => {
      dataset.push({
        x: idx,
        y: e.getValue()[i],
      });
    });
    datasets.push(dataset);
  }
  return datasets;
};
