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

class LocalStorageTrainingDataRepository implements TrainingDataRepository {
  constructor(private repositories: Repositories) {}

  public getTrainingData(): TrainingData {
    const gestures = get(this.repositories.getGestureRepository());

    const filters = this.repositories.getClassifierRepository().getFilters();
    const classes = gestures.map(gesture => {
      return {
        samples: this.buildFilteredSamples(gesture.getRecordings(), new Filters(filters)),
      };
    });

    return {
      classes,
    };
  }

  private buildFilteredSamples(recordings: RecordingData[], filters: Filters) {
    return recordings.map(recording => {
      const data = recording.samples;
      const highlightedAxes = get(stores.getHighlightedAxes());
      const value = highlightedAxes
        .toSorted((a, b) => a.index - b.index)
        .flatMap(e => filters.compute(data.map(d => d.vector[e.index])));
      return {
        value: value,
      };
    });
  }
}

export default LocalStorageTrainingDataRepository;
