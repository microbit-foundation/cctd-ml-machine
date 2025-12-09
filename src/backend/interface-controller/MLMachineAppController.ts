/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureProvider } from '../../core/featureprovider/FeatureProvider';
import { featureList, featureValues } from '../application/feature/FeatureList';
import { JSONFeatureProvider } from '../../core/featureprovider/JSONFeatureProvider';
import type { AppController } from './abstract/AppController';
import type { AbstractState } from '../interface-adapter/AbstractState';
import type { DevicesType } from '../application/devices/Devices';
import type { UserService } from '../domain/UserService';
import { MakecodeController } from './MakecodeController';

export class MLMachineAppController implements AppController {
  public constructor(
    private devices: AbstractState<DevicesType>,
    private userService: UserService,
  ) {}

  public setReconnectFlag(state: boolean): void {
    this.userService.setShouldReconnect(state);
  }

  public unsetReconnectFlag(): void {
    this.userService.setShouldReconnect(false);
  }

  public isReconnectFlagSet(): boolean {
    return this.userService.shouldReconnect();
  }

  public getDevices(): AbstractState<DevicesType> {
    return this.devices;
  }
  public getDocumentTitle(): string {
    return this.getFeatureProvider().require(featureList.title);
  }
  public getFeatureProvider(): FeatureProvider {
    return new JSONFeatureProvider(featureValues);
  }
}
