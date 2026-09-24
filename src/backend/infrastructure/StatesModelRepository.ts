/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { ModelInfo } from '../../core/model/ModelInfo';
import type { ModelRepository } from '../domain/ModelRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesModelRepository implements ModelRepository {
  constructor(private states: AbstractStates) {}

  getSelectedModel(): ModelInfo {
    return this.states.getSelectedModel().get();
  }

  setSelectedModel(model: ModelInfo): void {
    this.states.getSelectedModel().set(model);
  }
}
