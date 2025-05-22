/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  derived,
  get,
  type Readable,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import Classifier from './Classifier';
import { type Subscriber } from 'svelte/motion';
import SelectedModel from '../SelectedModel';
import ModelRegistry from '../ModelRegistry';
import type { Axis } from '../Axis';
import PersistantWritable from '../../repository/PersistantWritable';
import Logger from '../../utils/Logger';
import { t } from '../../../i18n';
import type Snackbar from '../../stores/Snackbar';
import type { ApplicationState } from '../../stores/applicationState';
import { knnHasTrained } from '../../stores/KNNStores';
import { trainKNNModel } from '../../../pages/training/TrainingPage';

class HighlightedAxes implements Writable<Axis[]> {
  private value: PersistantWritable<Axis[]>; // Use this.set instead of this.value.set!

  public constructor(
    private classifier: Classifier,
    private selectedModel: SelectedModel,
    private applicationState: Readable<ApplicationState>,
    private snackbar: Snackbar,
  ) {
    this.value = new PersistantWritable([], 'highlightedAxes');
  }

  public set(newValue: Axis[]): void {
    const beforeValue = get(this.value);
    this.value.set(newValue);

    const isNewDifferentFromBefore = () =>
      newValue.length !== beforeValue.length ||
      newValue.find(
        axis => beforeValue.find(e => e.index === axis.index) === undefined,
      ) !== undefined;

    if (isNewDifferentFromBefore()) {
      this.onChangedAxes();
    }
  }

  public update(updater: (state: Axis[]) => Axis[]): void {
    const beforeValue = get(this.value);
    const updatedValue = updater(beforeValue);
    this.set(updatedValue);
  }

  public subscribe(
    run: Subscriber<Axis[]>,
    invalidate?: (value?: Axis[]) => void,
  ): Unsubscriber {
    return derived([this.value], ([store]) => {
      return [...store].toSorted((a, b) => a.index - b.index);
    }).subscribe(run, invalidate);
  }

  public toggleAxis(axis: Axis) {
    if (
      !!get(this.value).find(val => val.label === axis.label && val.index === axis.index)
    ) {
      this.set(get(this.value).filter(e => e.index !== axis.index));
    } else {
      this.set([...get(this.value), axis]);
    }
  }

  public isAxisHighlighted(axis: Axis) {
    return !!get(this.value).find(e => e.index === axis.index && e.label === axis.label);
  }

  public isAxisIndexHighlighted(index: number) {
    return !!get(this.value).find(e => e.index === index);
  }

  /**
   * When the axis that has been selected is EXPLICITLY different from before
   */
  private async onChangedAxes() {
    Logger.log('HighlightedAxes', 'New axes detected');

    if (
      get(this.selectedModel).id === ModelRegistry.NeuralNetwork.id &&
      this.classifier.getModel().isTrained()
    ) {
      this.snackbar.sendMessage(get(t)('snackbar.axischanged.NNInvalid'));
    }

    this.classifier.getModel().markAsUntrained();

    if (
      get(this.selectedModel).id === ModelRegistry.KNN.id &&
      get(this.applicationState).isInputConnected
    ) {
      if (get(knnHasTrained)) {
        Logger.log('HighlightedAxes', 'Retraining KNN model due to axes changed');
        // Only train if the knn model has been trained before
        await trainKNNModel();
      }
    }
  }
}

export default HighlightedAxes;
