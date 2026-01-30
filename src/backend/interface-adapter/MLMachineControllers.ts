/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureService } from '../application/feature/FeatureService';
import type { DataService } from '../domain/DataService';
import { UserServiceImpl } from '../domain/implementation/UserServiceImpl';
import type { OutputService } from '../domain/OutputService';
import type { AbstractStates } from '../statemanagement/AbstractStates';
import { LocalStorageUserSessionRepository } from '../infrastructure/LocalStorageUserSessionRepository';
import type { AppController } from '../interface-controller/abstract/AppController';
import type { NotificationController } from '../interface-controller/abstract/NotificationsController';
import { AxisController } from '../interface-controller/AxisController';
import { ClassifierController } from '../interface-controller/ClassifierController';
import { DataController } from '../interface-controller/DataController';
import { FeatureController } from '../interface-controller/FeatureController';
import { GestureController } from '../interface-controller/GestureController';
import { MLMachineAppController } from '../interface-controller/MLMachineAppController';
import { MLMachineNotificationController } from '../interface-controller/MLMachineNotificationController';
import { OutputController } from '../interface-controller/OutputController';
import { GesturesStateAdapter } from './GesturesStateAdapter';
import { MLMachine } from './MLMachine';
import { MakeCodeController } from '../interface-controller/makecode/MakeCodeController';
import type { MicrobitService } from '../domain/microbit/MicrobitService';
import { MicrobitController } from '../interface-controller/MicrobitController';
import { StatesMakeCodeProjectRepository } from '../infrastructure/StatesMakeCodeProjectRepository';

export class MLMachineControllers {
  private gestureController: GestureController;
  private dataController: DataController;

  public constructor(
    private mlMachine: MLMachine,
    dataService: DataService,
    private featureService: FeatureService,
    private outputService: OutputService,
    private states: AbstractStates,
    private microbitService: MicrobitService,
  ) {
    this.gestureController = new GestureController(
      new GesturesStateAdapter(this.mlMachine.getGestureService()),
      this.mlMachine.getGestureService(),
    );
    this.dataController = new DataController(dataService, states.getLiveData());
  }

  public getAppController(): AppController {
    return new MLMachineAppController(
      this.mlMachine.getDevices(),
      new UserServiceImpl(new LocalStorageUserSessionRepository()),
      this.featureService,
    );
  }

  public getNotificationController(): NotificationController {
    return new MLMachineNotificationController(
      this.mlMachine.getNotificationService(),
      this.states,
    );
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

  public getMakeCodeController(): MakeCodeController {
    return new MakeCodeController(new StatesMakeCodeProjectRepository(this.states));
  }

  public getFeatureController(): FeatureController {
    return new FeatureController(this.featureService);
  }

  public getOutputController(): OutputController {
    return new OutputController(this.outputService, this.states);
  }

  public getMicrobitController() {
    return new MicrobitController(this.microbitService, this.states);
  }
}
