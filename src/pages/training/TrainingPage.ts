/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
import { highlightedAxis } from '../../script/stores/uiStore';
import Axes from '../../script/domain/Axes';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import StaticConfiguration from '../../StaticConfiguration';
import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
import { stores } from '../../script/stores/Stores';
import { FilterType } from '../../script/domain/FilterTypes';

export const loss = writable<LossTrainingIteration[]>([]);
export const resetLoss = () => loss.set([]);
export const trainingIterationHandler = (h: LossTrainingIteration) => {
    loss.update(newLoss => {
        newLoss.push(h);
        return newLoss;
    });
};

export const trainKNNModel = async () => {
    if (stores.getClassifier().getFilters().count() !== 2) {
        stores.getClassifier().getFilters().clear();
        stores.getClassifier().getFilters().add(FilterType.MAX);
        stores.getClassifier().getFilters().add(FilterType.MEAN);
    }
    const model = stores.getClassifier().getModel();
    await model.train(getKNNTrainer());
};

const getKNNTrainer = () => {
    const currentAxis = get(highlightedAxis);
    const offset = currentAxis === Axes.X ? 0 : currentAxis === Axes.Y ? 1 : 2;
    return new KNNNonNormalizedModelTrainer(StaticConfiguration.knnNeighbourCount, data =>
        extractAxisFromTrainingData(data, offset, 3),
    );
};
