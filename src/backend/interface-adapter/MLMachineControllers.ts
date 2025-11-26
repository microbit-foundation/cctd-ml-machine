/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { LiveData } from '../../lib/domain/stores/LiveData';
import type { DataService } from '../domain/DataService';
import { UserServiceImpl } from '../domain/implementation/UserServiceImpl';
import { LocalStorageUserSessionRepository } from '../infrastructure/LocalStorageUserSessionRepository';
import type { AppController } from '../interface-controller/abstract/AppController';
import type { NotificationController } from '../interface-controller/abstract/NotificationsController';
import { AxisController } from '../interface-controller/AxisController';
import { ClassifierController } from '../interface-controller/ClassifierController';
import { DataController } from '../interface-controller/DataController';
import { GestureController } from '../interface-controller/GestureController';
import { MLMachineAppController } from '../interface-controller/MLMachineAppController';
import { MLMachineNotificationController } from '../interface-controller/MLMachineNotificationController';
import type { AbstractReadonlyState } from './AbstractReadonlyState';
import { GesturesStateAdapter } from './GesturesStateAdapter';
import { MLMachine } from './MLMachine';

export class MLMachineControllers {
  private gestureController: GestureController;
  private dataController: DataController;

  public constructor(
    private mlMachine: MLMachine,
    dataService: DataService,
    liveData: AbstractReadonlyState<LiveData<LiveDataVector>>,
  ) {
    this.gestureController = new GestureController(
      new GesturesStateAdapter(this.mlMachine.getGestureService()),
      this.mlMachine.getGestureService(),
    );
    this.dataController = new DataController(dataService, liveData);
  }

  public getAppController(): AppController {
    return new MLMachineAppController(
      this.mlMachine.getDevices(),
      new UserServiceImpl(new LocalStorageUserSessionRepository()),
    );
  }

  public getNotificationController(): NotificationController {
    return new MLMachineNotificationController(this.mlMachine.getNotificationService());
  }

  public getClassifierController(): ClassifierController {
    return new ClassifierController(this.mlMachine);
  }

  public getAxisController(): AxisController {
    return new AxisController(this.mlMachine);
  }

  public getGestureController(): GestureController {
    return this.gestureController;
  }

  public getDataController(): DataController {
    return this.dataController;
  }
}
