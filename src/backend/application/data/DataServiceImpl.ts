/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Dataset } from '../../../core/dataset/Dataset';
import type { Axis } from '../../../core/entities/Axis';
import type { NewGesture } from '../../../core/entities/NewGesture';
import type { Recording } from '../../../core/entities/recording/Recording';
import { RecordingImpl } from '../../../core/entities/recording/RecordingImpl';
import { Sample } from '../../../core/entities/recording/Sample';
import type { Filter, FilterType } from '../../../core/filter/Filter';
import { createFilter } from '../../../core/filter/FilterUtils';
import type { LiveDataStore } from '../../../core/LiveDataStore';
import { ModelOption } from '../../../core/model/ModelOption';
import { SettingsChange } from '../../../core/model/SettingsChange';
import FilterGraphLimits from '../../../core/utils/FilterGraphLimits';
import BaseVector from '../../../core/vector/BaseVector';
import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
import type { Vector } from '../../../core/vector/Vector';
import type { AxisRepository } from '../../domain/AxisRepository';
import type { DataService } from '../../domain/DataService';
import type { FilterRepository } from '../../domain/FilterRepository';
import type { GestureService } from '../../domain/GestureService';
import type { LiveDataRepository } from '../../domain/LiveDataRepository';
import type { ModelTrainingStateRepository } from '../../domain/ModelTrainingStateRepository';
import { GestureDatasetFactory } from './GestureDatasetFactory';

export class DataServiceImpl implements DataService {
  private readonly gestureDatasetFactory: GestureDatasetFactory;

  constructor(
    private axisRepository: AxisRepository,
    private liveDataRepository: LiveDataRepository,
    private filterRepository: FilterRepository,
    private gestureService: GestureService,
    private modelTrainingRepository: ModelTrainingStateRepository,
  ) {
    this.gestureDatasetFactory = new GestureDatasetFactory(this.gestureService);
  }

  setAvailableAxes(axes: Axis[]): void {
    const oldAxes = this.axisRepository.getAvailableAxes();
    this.axisRepository.setAvailableAxes(axes);

    // If theres any changes to the available axes, we select them all
    const oldAxisIndices = oldAxes
      .map(ax => ax.index)
      .sort()
      .join(',');
    const newAxisIndices = axes
      .map(ax => ax.index)
      .sort()
      .join(',');
    if (oldAxisIndices !== newAxisIndices) {
      this.axisRepository.setSelectedAxes(axes);
    }
  }

  setLiveDataStore(data: LiveDataStore<LiveDataVector>): void {
    this.liveDataRepository.setLiveDataStore(data);
  }

  hasSufficientDataForTraining(): boolean {
    const gestures = this.gestureService.getGestures();
    for (const gesture of gestures) {
      if (gesture.getRecordings().length < 3) {
        return false;
      }
    }
    return gestures.length >= 2;
  }

  getLiveData(duration: number, noOfSamples: number): LiveDataVector[] {
    return this.liveDataRepository.getSeries(duration, noOfSamples).map(e => e.value);
  }

  getFilters(): Filter[] {
    return this.filterRepository.getFilters();
  }

  toggleFilter(filterType: FilterType): void {
    const filters = this.filterRepository.getFilters();

    const isActive = filters.some(f => f.getType() === filterType);
    let newFilters: Filter[];
    if (isActive) {
      newFilters = filters.filter(f => f.getType() !== filterType);
    } else {
      newFilters = [...filters, createFilter(filterType)];
    }
    this.filterRepository.saveFilters(newFilters);
    const modelTraining = this.modelTrainingRepository.getModelTraining();
    modelTraining.addPendingSetting(new SettingsChange(new ModelOption("Filters"), filters.map(f => f.getType()), newFilters.map(f => f.getType())));
    this.modelTrainingRepository.saveModelTraining(modelTraining);
  }

  getTrainingDataset(normalize: boolean): Dataset {
    const dataset = this.gestureDatasetFactory.buildDataset(
      (gesture: NewGesture) => gesture.getRecordings(),
      this.getSelectedAxes(),
      this.getFilters(),
    );
    if (!normalize) {
      return dataset;
    }
    const mean = dataset.getFeatureMean();
    const std = dataset.getFeatureStandardDeviation();
    const labels = dataset.getLabels();
    const normalizedFeatureSet = dataset
      .getFeatureSet()
      .map((featureData,featureIdx) => {
        const normalizedFeatures = featureData
          .getFeatures()
          .getValue()
          .map((feature, index) => (feature - mean.getValueByIndex(index)) / std.getValueByIndex(index));
        return {
          getFeatures: () => new BaseVector(normalizedFeatures),
          getLabel: () => labels.getIndexLabels()[featureIdx],
        };
      });
    return {
      getFeatureSet: () => normalizedFeatureSet,
      getNormalizedFeatureSet: () => normalizedFeatureSet,
      getLabels: () => dataset.getLabels(),
      isValid: () => dataset.isValid(),
      isEmpty: () => dataset.isEmpty(),
      getNumberOfClasses: () => dataset.getNumberOfClasses(),
      getFeatureSize: () => dataset.getFeatureSize(),
      getFeatureMean: () => mean,
      getFeatureStandardDeviation: () => std,
    };
  }

  getValidationDataset(): Dataset {
    return this.gestureDatasetFactory.buildDataset(
      (gesture: NewGesture) => gesture.getValidationRecordings(),
      this.getSelectedAxes(),
      this.getFilters(),
    );
  }

  addLiveData(input: LiveDataVector): void {
    this.liveDataRepository.addInput(input);
  }

  setSelectedAxes(axes: Axis[]): void {
    const oldAxes = this.axisRepository.getSelectedAxes();
    this.axisRepository.setSelectedAxes(axes);

    const modelTraining = this.modelTrainingRepository.getModelTraining();
    modelTraining.addPendingSetting(new SettingsChange(new ModelOption("Selected Axes"), oldAxes.map(ax => ax.index), axes.map(ax => ax.index)));
    this.modelTrainingRepository.saveModelTraining(modelTraining);
  }

  toggleAxis(axis: Axis): void {
    const isSelected = this.isAxisSelected(axis);
    if (isSelected) {
      // TODO: Maybe this should be axisRepository.removeSelectedAxis(...)
      this.setSelectedAxes(
        [...this.getSelectedAxes()].filter(ax => ax.index !== axis.index),
      );
    } else {
      this.setSelectedAxes([...this.getSelectedAxes(), axis]);
    }
  }

  getAvailableAxes(): Axis[] {
    return this.axisRepository.getAvailableAxes();
  }

  public getAxisFromIndex(index: number): Axis | undefined {
    return this.axisRepository.getAvailableAxes().find(ax => ax.index === index);
  }

  public isAxisSelected(axis: Axis): boolean {
    return !!this.axisRepository.getSelectedAxes().find(ax => ax.index === axis.index);
  }

  public getSelectedAxes(): Axis[] {
    return this.axisRepository.getSelectedAxes();
  }

  extractSelectedAxesFromVector(data: Vector): Vector {
    const selectedAxisIndices = this.getSelectedAxes().map(ax => ax.index);
    return data.extract(selectedAxisIndices);
  }

  extractSelectedAxesFromVectors(data: Vector[]): Vector[] {
    return data.map(vector => this.extractSelectedAxesFromVector(vector));
  }

  extractSelectedAxesFromRecording(recording: Recording): Recording {
    const selectedAxisIndices = this.getSelectedAxes().map(ax => ax.index);
    const samplesValuesExtracted = this.extractSelectedAxesFromVectors(
      recording.getSamples(),
    );
    const axes = selectedAxisIndices
      .map(index => this.getAxisFromIndex(index))
      .filter((ax): ax is Axis => ax !== undefined);
    return new RecordingImpl(
      recording.getId(),
      samplesValuesExtracted.map(sampleValue => new Sample(sampleValue)),
      axes,
    );
  }

  /**
   * Graph normalization is used to make data look nicer in graphs.
   *
   * Expects format: [f1r1, f1r2, f1r3, f2r1, f2r2, f2r3] where f1 is filter 1 and r1 is row 1
   */
  graphNormalize(value: Vector): Vector {
    const filters = this.getFilters();
    const noOfFilters = filters.length;
    const result: number[] = [];
    value.getValue().forEach((val, index) => {
      const filterIndex = index % noOfFilters;
      const filter = filters[filterIndex];
      const { min, max } = FilterGraphLimits.getFilterLimits(filter);
      const newMin = 0;
      const newMax = 1;
      const existingMin = min;
      const existingMax = max;
      const normalizedValue =
        ((newMax - newMin) * (val - existingMin)) / (existingMax - existingMin) + newMin;
      result.push(normalizedValue);
    });
    return new BaseVector(result);
  }

  // Data could be a recording or buffered live data
  applyFilters(data: Vector[]): Vector {
    const filters = this.getFilters();
    const vectorSize = data[0].getSize();
    const byRowData = [...Array(vectorSize)].map((_, i) =>
      data.map(vector => vector.getValueByIndex(i)),
    );
    const filteredData: number[] = [];
    filters.forEach(filter => {
      byRowData.forEach(row => {
        const filtered = filter.filter(row);
        filteredData.push(filtered);
      });
    });

    // Outputs [f1r1, f1r2, f1r3, f2r1, f2r2, f2r3] where f1 is filter 1 and r1 is row 1
    return new BaseVector(filteredData);
  }
}
