/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { Filter } from '../../core/filter/Filter';
import type { ClassifierService } from '../domain/ClassifierService';
import type { FilterListListener } from '../domain/eventlistener/FilterListListener';
import type { SelectedAxesListener } from '../domain/eventlistener/SelectedAxesListener';
import type { ModelService } from '../domain/ModelService';

export class FilterSelectionListener implements FilterListListener, SelectedAxesListener {
  private modelService?: ModelService;
  private lastSyncedSignature?: string;
  private selectedAxesCount: number;
  private selectedFilterCount: number;

  public constructor(initialSelectedAxes: Axis[], initialFilters: Filter[]) {
    this.selectedAxesCount = initialSelectedAxes.length;
    this.selectedFilterCount = initialFilters.length;
  }

  public setModelService(modelService: ModelService): void {
    this.modelService = modelService;
  }

  public onFiltersChanged(filters: Filter[]): void {
    this.selectedFilterCount = filters.length;
    this.syncInputNodeCount();
  }

  public onSelectedAxesChanged(selectedAxes: Axis[]): void {
    this.selectedAxesCount = selectedAxes.length;
    this.syncInputNodeCount();
  }

  private syncInputNodeCount(): void {
    if (!this.modelService) {
      return;
    }

    const signature = `${this.selectedFilterCount}|${this.selectedAxesCount}`;
    if (signature === this.lastSyncedSignature) {
      return;
    }

    this.lastSyncedSignature = signature;
    this.modelService.setNeuralNetworkInputNodeCount(
      this.selectedFilterCount,
      this.selectedAxesCount,
    );
  }
}
