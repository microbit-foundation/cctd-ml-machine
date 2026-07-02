/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
/**
 * @vitest-environment jsdom
 */

import { describe, expect, test } from 'vitest';
import { writable } from 'svelte/store';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Axis } from '../../core/entities/Axis';
import { FilterType } from '../../core/filter/Filter';
import { Feature } from '../../backend/application/feature/Feature';
import { SvelteStates } from '../../backend/statemanagement/SvelteStates';
import { SvelteStateAdapter } from '../../backend/statemanagement/SvelteStateAdapter';
import { DataServiceImpl } from '../../backend/application/data/DataServiceImpl';
import { StatesAxisRepository } from '../../backend/infrastructure/StatesAxisRepository';
import { StatesFilterRepository } from '../../backend/infrastructure/StatesFilterRepository';
import { AxisController } from '../../backend/interface-controller/AxisController';
import { FilterController } from '../../backend/interface-controller/FilterController';
import { FilterSelectionListener } from '../../backend/interface-listener/FilterSelectionListener';
import { BasicNeuralNetworkArchitecture } from '../../core/model/neural-network/BasicNeuralNetworkArchitecture';
import { NeuralNetworkSettingsImpl } from '../../core/model/neural-network/NeuralNetworkSettingsImpl';

const createStates = (initialAxes: Axis[]) => {
  return new SvelteStates(
    [],
    {
      getFeature: <T>(feature: Feature) => {
        if (feature !== Feature.RECORDING_DURATION) {
          throw new Error(`Unsupported feature: ${feature}`);
        }
        return {
          getValue: () => 2000 as T,
          isSet: () => true,
        };
      },
    } as any,
    new SvelteStateAdapter<NewGesture | undefined>(writable(undefined)),
    initialAxes,
  );
};

describe('Neural network architecture sync integration', () => {
  test('selecting and deselecting filters updates the neural network input layer size', () => {
    const initialAxes: Axis[] = [
      { index: 0, label: 'x' },
      { index: 1, label: 'y' },
      { index: 2, label: 'z' },
    ];
    const states = createStates(initialAxes);
    const filterSelectionListener = new FilterSelectionListener(
      states.getSelectedAxes().get(),
      states.getFilters().get(),
    );
    const filterRepository = new StatesFilterRepository(states, [
      filterSelectionListener,
    ]);
    const axisRepository = new StatesAxisRepository(
      {
        getGestures: () => [],
      } as any,
      states,
      [filterSelectionListener],
    );
    const dataService = new DataServiceImpl(
      axisRepository,
      {
        setLiveDataStore: () => {},
        getSeries: () => [],
        addInput: () => {},
      } as any,
      filterRepository,
      {
        getGestures: () => [],
      } as any,
      {
        getModelTraining: () => ({
          addPendingSetting: () => {},
        }),
        saveModelTraining: () => {},
      } as any,
    );
    filterSelectionListener.setModelService({
      setNeuralNetworkInputNodeCount: (filterCount: number, axesCount: number) => {
        const currentSettings = states.getNeuralNetworkSettings().get();
        const newArchitecture = new BasicNeuralNetworkArchitecture(
          currentSettings.getArchitecture().getOutputLayer().getNumberOfNodes(),
          filterCount * axesCount,
          currentSettings.getArchitecture().getHiddenLayers()[0].getNumberOfNodes(),
        );
        states
          .getNeuralNetworkSettings()
          .set(
            new NeuralNetworkSettingsImpl(
              currentSettings.getLearningSettings(),
              newArchitecture,
              currentSettings.getTrainingObserver(),
            ),
          );
      },
    } as any);
    const axisController = new AxisController(
      {
        getDataService: () => dataService,
      } as any,
      states,
    );
    const filterController = new FilterController(states, dataService);

    expect(
      states
        .getNeuralNetworkSettings()
        .get()
        .getArchitecture()
        .getInputLayer()
        .getNumberOfNodes(),
    ).toBe(24);

    axisController.setSelectedAxes(initialAxes.slice(0, 2));
    expect(
      states
        .getNeuralNetworkSettings()
        .get()
        .getArchitecture()
        .getInputLayer()
        .getNumberOfNodes(),
    ).toBe(16);

    filterController.toggleFilter(FilterType.RMS);
    expect(
      states
        .getNeuralNetworkSettings()
        .get()
        .getArchitecture()
        .getInputLayer()
        .getNumberOfNodes(),
    ).toBe(14);

    filterController.toggleFilter(FilterType.RMS);
    expect(
      states
        .getNeuralNetworkSettings()
        .get()
        .getArchitecture()
        .getInputLayer()
        .getNumberOfNodes(),
    ).toBe(16);
  });
});
