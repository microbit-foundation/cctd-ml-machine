/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable, type Readable, derived } from 'svelte/store';
import type SmoothedLiveData from '../lib/livedata/SmoothedLiveData';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import StaticConfiguration from '../../StaticConfiguration';
import { getControllers } from '../../backend/interface-adapter/MLMachine';

export type LabelData = {
  id: number;
  label: string;
  color: string;
  arrowHeight: number;
  textHeight: number;
};

export class DimensionLabelsController {
  private static readonly CHARACTER_HEIGHT = 16;
  private labelsStore = writable<LabelData[]>([]);
  private unsubscribeFromLiveData: (() => void) | undefined;

  constructor(
    private liveData: SmoothedLiveData<LiveDataVector>,
    private getMaxValue: () => number,
    private getMinValue: () => number,
    private getGraphHeight: () => number,
  ) {
    this.labelsStore.set(this.initializeLabels());
  }

  public get labels(): Readable<LabelData[]> {
    return this.labelsStore;
  }

  public get labelEnabled(): Readable<boolean[]> {
    const highlightedAxes = getControllers().getAxisController().getSelectedAxes();
    return derived([highlightedAxes, this.labelsStore], ([axes, currentLabels]) => {
      return currentLabels.map(
        (_, idx) => axes.find(axis => axis.index === idx) !== undefined,
      );
    });
  }

  public start() {
    this.unsubscribeFromLiveData = this.liveData.subscribe(data => {
      const dataInArray = Array.from(data.getValue());
      this.updateDimensionLabels(dataInArray);
    });
  }

  public stop() {
    this.unsubscribeFromLiveData?.();
  }

  private initializeLabels(): LabelData[] {
    const labels: LabelData[] = [];
    for (let i = 0; i < this.liveData.getSeriesSize(); i++) {
      const label = this.liveData.getLabels()[i];
      const color = StaticConfiguration.graphColors[i];
      labels.push({
        id: i,
        label: label,
        color: color,
        arrowHeight: 0,
        textHeight: 0,
      });
    }
    return labels;
  }

  private updateDimensionLabels(axes: number[]) {
    const maxValue = this.getMaxValue();
    const minValue = this.getMinValue();
    const graphHeight = this.getGraphHeight();
    const normalMax = maxValue - minValue;

    this.labelsStore.update(currentLabels => {
      const updated = currentLabels.map(label => {
        const normalValue = axes[label.id] - minValue;
        const newValue = (normalValue / normalMax) * graphHeight;
        return {
          ...label,
          arrowHeight: newValue + 4,
          textHeight: newValue - DimensionLabelsController.CHARACTER_HEIGHT + 2,
        };
      });
      return this.fixOverlappingLabels(updated);
    });
  }

  private fixOverlappingLabels(labels: LabelData[]): LabelData[] {
    const sorted = [...labels].sort((a, b) => a.arrowHeight - b.arrowHeight);
    for (let i = 1; i < sorted.length; i++) {
      const element = sorted[i];
      const previousLabel = sorted[i - 1];
      if (
        element.textHeight <
        previousLabel.textHeight + DimensionLabelsController.CHARACTER_HEIGHT
      ) {
        element.textHeight =
          previousLabel.textHeight + DimensionLabelsController.CHARACTER_HEIGHT;
      }
    }
    // Return to original order based on ID to keep the store predictable
    return labels;
  }
}
