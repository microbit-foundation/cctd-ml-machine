/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get, writable } from 'svelte/store';
import { LossTrainingIteration } from '../../components/graphs/LossGraphUtil';
import { highlightedAxis, selectedModel } from '../../script/stores/uiStore';
import Axes from '../../script/domain/Axes';
import KNNNonNormalizedModelTrainer from '../../script/mlmodels/KNNNonNormalizedModelTrainer';
import StaticConfiguration from '../../StaticConfiguration';
import { extractAxisFromTrainingData } from '../../script/utils/graphUtils';
import { stores } from '../../script/stores/Stores';
import { FilterType } from '../../script/domain/FilterTypes';
import CookieManager from '../../script/CookieManager';
import { appInsights } from '../../appInsights';
import ModelRegistry, { ModelInfo } from '../../script/domain/ModelRegistry';
import LayersModelTrainer from '../../script/mlmodels/LayersModelTrainer';

export const loss = writable<LossTrainingIteration[]>([]);

const trainingIterationHandler = (h: LossTrainingIteration) => {
    loss.update(newLoss => {
        newLoss.push(h);
        return newLoss;
    });
};

/**
 * @deprecated
 */
export const trainKNNModel = async () => {
    if (stores.getClassifier().getFilters().count() !== 2) {
        stores.getClassifier().getFilters().clear();
        stores.getClassifier().getFilters().add(FilterType.MAX);
        stores.getClassifier().getFilters().add(FilterType.MEAN);
    }
    const model = stores.getClassifier().getModel();

    trackModelEvent();
    await model.train(getKNNTrainer());
};

/**
 * @deprecated
 */
const getKNNTrainer = () => {
    const currentAxis = get(highlightedAxis);
    const offset = currentAxis === Axes.X ? 0 : currentAxis === Axes.Y ? 1 : 2;
    trackModelEvent();
    return new KNNNonNormalizedModelTrainer(StaticConfiguration.knnNeighbourCount, data =>
        extractAxisFromTrainingData(data, offset, 3),
    );
};

const trainNNModel = async () => {
    loss.set([]);
    const modelTrainer = new LayersModelTrainer(StaticConfiguration.layersModelTrainingSettings, trainingIterationHandler);
    await stores.getClassifier().getModel().train(modelTrainer);
}

// TODO: Replace with name trainKNNModel after removing deprecated trainKNNModel
const trainKNN = async () => {
    const currentAxis = get(highlightedAxis);
    const offset = currentAxis === Axes.X ? 0 : currentAxis === Axes.Y ? 1 : 2;
    const modelTrainer = new KNNNonNormalizedModelTrainer(StaticConfiguration.knnNeighbourCount, data =>
        extractAxisFromTrainingData(data, offset, 3) // 3 assumes 3 axis
    )
    await stores.getClassifier().getModel().train(modelTrainer);
}

export const trainModel = async (model: ModelInfo) => {
    if (ModelRegistry.KNN.id === model.id) {
        await trainKNN();
    } else if (ModelRegistry.NeuralNetwork.id === model.id) {
        await trainNNModel();
    }
    trackModelEvent();
}

const trackModelEvent = () => {
    if (CookieManager.getComplianceChoices().analytics) {
        appInsights.trackEvent({
            name: 'ModelTrained',
            properties: {
                modelType: get(selectedModel).id,
            },
        });
    }
};