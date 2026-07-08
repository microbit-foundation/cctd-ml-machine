/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { getControllers } from '../../backend/interface-adapter/MLMachine';

export const trainNNModel = async () => {
  await getControllers().getClassifierController().trainNeuralNetworkModel();
};
