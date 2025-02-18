/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get } from 'svelte/store';
import Filters from '../domain/Filters';
import { type TrainingData } from '../domain/ModelTrainer';
import type { Repositories } from '../domain/Repositories';
import type { RecordingData } from '../domain/stores/gesture/Gestures';
import type { TrainingDataRepository } from '../domain/TrainingDataRepository';
import { stores } from '../stores/Stores';
import type { LocalStorageFiltersRepository } from './LocalStorageFiltersRepository';
import type { Vector } from '../domain/Vector';
import BaseVector from '../domain/BaseVector';
import { getMean, getStandardDeviation } from '../utils/Math';

class LocalStorageTrainingDataRepository implements TrainingDataRepository {
  constructor(
    private repositories: Repositories,
    private filtersRepository: LocalStorageFiltersRepository,
  ) {}

  public getTrainingData(): TrainingData {
    const gestures = get(this.repositories.getGestureRepository());

    const filters = this.filtersRepository.getFilters();
    const classes = gestures.map(gesture => {
      return {
        samples: this.buildFilteredSamples(gesture.getRecordings(), filters),
      };
    });

    return {
      classes,
    };
  }

  public getTrainingDataStdDeviation(): Vector {
    const trainingData = this.getTrainingData().classes.flatMap(e => e.samples.map(e => e.value))
    return getStandardDeviation(trainingData);
  }

  public getTrainingDataMean(): Vector {
    const trainingData = this.getTrainingData().classes.flatMap(e => e.samples.map(e => e.value))
    return getMean(trainingData);
  }

  private buildFilteredSamples(
    recordings: RecordingData[],
    filters: Filters,
  ): { value: Vector }[] {
    return recordings.map(recording => {
      const data = recording.samples;
      const highlightedAxes = get(stores.getHighlightedAxes());
      const value = highlightedAxes
        .toSorted((a, b) => a.index - b.index)
        .flatMap(e => {
          return filters.compute(data.map(d => d.vector[e.index]));
        });
      return {
        value: new BaseVector(value),
      };
    });
  }
}

export default LocalStorageTrainingDataRepository;
