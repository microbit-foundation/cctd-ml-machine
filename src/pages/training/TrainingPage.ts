/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import { stores } from '../../lib/stores/Stores';
import { type ModelInfo } from '../../core/entities/classifier/models/ModelRegistry';
import type { MLModel } from '../../core/entities/classifier/models/MLModel';
import type { ModelTrainer } from '../../core/entities/classifier/models/ModelTrainer';
import KNNModelTrainer from '../../lib/legacy/KNNModelTrainer';
import KNNNonNormalizedModelTrainer from '../../lib/legacy/KNNNonNormalizedModelTrainer';
import { getControllers } from '../../backend/interface-adapter/MLMachine';

export const trainNNModel = async () => {
  await getControllers().getClassifierController().trainNeuralNetworkModel();
};

export const trainKNNModel = async () => {
  getControllers().getClassifierController().trainKNNModel();
};

export const selectModel = async (model: ModelInfo) => {
  stores.getSelectedModel().set(model);
};
