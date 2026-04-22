/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Dataset } from '../../../core/dataset/Dataset';
import type { Axis } from '../../../core/entities/Axis';
import type { NewGesture } from '../../../core/entities/NewGesture';
import type { Filter, FilterType } from '../../../core/filter/Filter';
import { createFilter } from '../../../core/filter/FilterUtils';
import type { LiveDataVector } from '../../../core/vector/LiveDataVector';
import type { Vector } from '../../../core/vector/Vector';
import type { AxisRepository } from '../../domain/AxisRepository';
import type { DataService } from '../../domain/DataService';
import type { FilterRepository } from '../../domain/FilterRepository';
import type { GestureService } from '../../domain/GestureService';
import type { LiveDataRepository } from '../../domain/LiveDataRepository';
import { GestureDatasetFactory } from './GestureDatasetFactory';

export class DataServiceImpl implements DataService {
  private readonly gestureDatasetFactory: GestureDatasetFactory;

  constructor(
    private axisRepository: AxisRepository,
    private liveDataRepository: LiveDataRepository,
    private filterRepository: FilterRepository,
    private gestureService: GestureService,
  ) {
    this.gestureDatasetFactory = new GestureDatasetFactory(this.gestureService);
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
    if (isActive) {
      this.filterRepository.saveFilters(filters.filter(f => f.getType() !== filterType));
    } else {
      this.filterRepository.saveFilters([...filters, createFilter(filterType)]);
    }
  }

  getTrainingDataset(): Dataset {
    return this.gestureDatasetFactory.buildDataset(
      (gesture: NewGesture) => gesture.getRecordings(),
      this.getSelectedAxes(),
      this.getFilters(),
    );
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
}
