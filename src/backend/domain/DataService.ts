/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Dataset } from '../../core/dataset/Dataset';
import type { Axis } from '../../core/entities/Axis';
import type { Recording } from '../../core/entities/recording/Recording';
import type { Filter, FilterType } from '../../core/filter/Filter';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { Vector } from '../../core/vector/Vector';

export interface DataService {
  addLiveData(input: LiveDataVector): void;
  getLiveData(duration: number, noOfSamples: number): LiveDataVector[];
  setSelectedAxes(axes: Axis[]): void;
  toggleAxis(axis: Axis): void;
  getAvailableAxes(): Axis[];
  getSelectedAxes(): Axis[];
  getAxisFromIndex(index: number): Axis | undefined;
  isAxisSelected(axis: Axis): boolean;
  getFilters(): Filter[];
  toggleFilter(filterType: FilterType): void;
  getTrainingDataset(): Dataset;
  getValidationDataset(): Dataset;
  hasSufficientDataForTraining(): boolean;
  extractSelectedAxesFromVector(data: Vector): Vector
  extractSelectedAxesFromRecording(recording: Recording): Recording;
  graphNormalize(value: Vector): Vector;
  applyFilters(data: Vector[]): Vector;
}
