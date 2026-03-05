/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AppController } from './abstract/AppController';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { DevicesType } from '../application/devices/Devices';
import type { UserService } from '../domain/UserService';
import type { FeatureService } from '../application/feature/FeatureService';
import { Feature } from '../application/feature/Feature';

export class MLMachineAppController implements AppController {
  public constructor(
    private devices: AbstractState<DevicesType>,
    private userService: UserService,
    private featureService: FeatureService,
  ) {}

  public setReconnectFlag(state: boolean): void {
    this.userService.setShouldReconnectNextVisit(state);
  }

  public unsetReconnectFlag(): void {
    this.userService.setShouldReconnectNextVisit(false);
  }

  public isReconnectFlagSet(): boolean {
    return this.userService.shouldReconnect();
  }

  public getDevices(): AbstractState<DevicesType> {
    return this.devices;
  }
  public getDocumentTitle(): string {
    return this.featureService.getFeature<string>(Feature.TITLE).getValue();
  }
}
