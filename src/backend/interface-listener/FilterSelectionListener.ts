/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Axis } from '../../core/entities/Axis';
import type { Filter } from '../../core/filter/Filter';
import type { ClassifierService } from '../domain/ClassifierService';
import type { FilterListListener } from '../domain/FilterListListener';
import type { SelectedAxesListener } from '../domain/SelectedAxesListener';

export class FilterSelectionListener
  implements FilterListListener, SelectedAxesListener
{
  private classifierService?: ClassifierService;
  private lastSyncedSignature?: string;
  private selectedAxesCount: number;
  private selectedFilterCount: number;

  public constructor(
    initialSelectedAxes: Axis[],
    initialFilters: Filter[],
  ) {
    this.selectedAxesCount = initialSelectedAxes.length;
    this.selectedFilterCount = initialFilters.length;
  }

  public setClassifierService(classifierService: ClassifierService): void {
    this.classifierService = classifierService;
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
    if (!this.classifierService) {
      return;
    }

    const signature = `${this.selectedFilterCount}|${this.selectedAxesCount}`;
    if (signature === this.lastSyncedSignature) {
      return;
    }

    this.lastSyncedSignature = signature;
    this.classifierService.setNeuralNetworkInputNodeCount(
      this.selectedFilterCount,
      this.selectedAxesCount,
    );
  }
}