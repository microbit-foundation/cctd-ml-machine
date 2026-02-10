/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Dataset } from '../../../core/dataset/Dataset';
import DatasetImpl from '../../../core/dataset/DatasetImpl';
import type { DatasetLabels } from '../../../core/dataset/DatasetLabels';
import { DatasetLabelsImpl } from '../../../core/dataset/DatasetLabelsImpl';
import type { FeatureData } from '../../../core/dataset/FeatureData';
import { FeatureDataImpl } from '../../../core/dataset/FeatureDataImpl';
import { LabelledFeatureSetImpl } from '../../../core/dataset/LabelledFeatureSetImpl';
import type { Axis } from '../../../core/entities/Axis';
import type { Recording } from '../../../core/entities/recording/Recording';
import type { Filter } from '../../../core/filter/Filter';
import BaseVector from '../../../core/vector/BaseVector';
import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
import type { AxisRepository } from '../../domain/AxisRepository';
import type { DataService } from '../../domain/DataService';
import type { FilterRepository } from '../../domain/FilterRepository';
import type { GestureService } from '../../domain/GestureService';
import type { LiveDataRepository } from '../../domain/LiveDataRepository';

export class DataServiceImpl implements DataService {
  constructor(
    private axisRepository: AxisRepository,
    private liveDataRepository: LiveDataRepository,
    private filterRepository: FilterRepository,
    private gestureService: GestureService,
  ) {}

  getFilters(): Filter[] {
    return this.filterRepository.getFilters();
  }

  getTrainingDataset(): Dataset {
    const gestures = this.gestureService.getGestures();
    const filters = this.filterRepository.getFilters();

    const featureData: FeatureData[] = gestures.flatMap(gesture => {
      const recordings = gesture.getRecordings();
      return recordings.map(recording => {
        return this.createFeatureDataFromRecording(
          recording,
          filters,
          this.getSelectedAxes(),
        );
      });
    });

    const featureSum = new BaseVector(Array(filters.length).fill(0));
    featureData.forEach(fd => {
      const features = fd.getFeatures();
      featureSum.add(features);
    });
    const featureMean = featureSum.divideByScalar(featureData.length);
    const featureStdDeviation = new BaseVector(Array(filters.length).fill(0));
    featureData.forEach(fd => {
      const features = fd.getFeatures();
      const diff = features.subtract(featureMean);
      const squaredDiff = new BaseVector(diff.getValue().map(val => val * val));
      featureStdDeviation.add(squaredDiff);
    });
    featureStdDeviation.divideByScalar(featureData.length);
    const featureSize = featureData[0].getFeatures().getSize();

    const labelVectors: BaseVector[] = gestures.flatMap((gesture, idx) => {
      const recordings = gesture.getRecordings();
      const vector = Array(recordings.length).fill(0);
      vector[idx] = 1;
      return recordings.map(() => new BaseVector(vector));
    });
    const datasetLabels: DatasetLabels = new DatasetLabelsImpl(labelVectors);

    const labelledFeatureSet = new LabelledFeatureSetImpl(featureData, datasetLabels);

    return new DatasetImpl(
      labelledFeatureSet,
      featureSize,
      featureMean,
      featureStdDeviation,
    );
  }

  getValidationDataset(): Dataset {
    throw new Error('Method not implemented.');
  }

  addLiveData(input: LiveDataVector): void {
    this.liveDataRepository.addInput(input);
  }

  setSelectedAxes(axes: Axis[]): void {
    this.axisRepository.setSelectedAxes(axes);
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

  private createFeatureDataFromRecording(
    recording: Recording,
    filters: Filter[],
    axes: Axis[],
  ): FeatureData {
    const samples = recording.getSamples();
    const samplesByAxis = axes.map(axis =>
      samples.map(sample => sample.getValue()[axis.index]),
    );
    const features: number[] = [];
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      for (let j = 0; j < samplesByAxis.length; j++) {
        const axisSamples = samplesByAxis[j];
        const filteredValue = filter.filter(axisSamples);
        features.push(filteredValue);
      }
    }

    return new FeatureDataImpl(new BaseVector(features));
  }
}
