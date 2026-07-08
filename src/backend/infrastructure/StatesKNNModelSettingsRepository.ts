/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { KNNModelSettings } from '../../core/model/KNN/KNNModelSettings';
import type { KNNModelSettingsRepository } from '../domain/KNNModelSettingsRepository';
import type { AbstractStates } from '../statemanagement/AbstractStates';

export class StatesKNNModelSettingsRepository implements KNNModelSettingsRepository {
  private log = new ConsoleLogger(StatesKNNModelSettingsRepository.name);
  public constructor(private states: AbstractStates) {}

  public getKNNModelSettings(): KNNModelSettings {
    return this.states.getKNNModelSettings().get();
  }

  public save(settings: KNNModelSettings): void {
    this.states.getKNNModelSettings().set(settings);
    this.log.info('Saved KNNModelSettings', settings);
  }
}
