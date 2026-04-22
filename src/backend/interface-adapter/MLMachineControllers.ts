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
import { MLMachine } from './MLMachine';
import { MakeCodeController } from '../interface-controller/makecode/MakeCodeController';
import type { MicrobitService } from '../domain/microbit/MicrobitService';
import { MicrobitController } from '../interface-controller/MicrobitController';
import { StatesMakeCodeProjectRepository } from '../infrastructure/StatesMakeCodeProjectRepository';
import type { NotificationService } from '../domain/NotificationService';
import { ValidationController } from '../interface-controller/ValidationController';
import type { ValidationService } from '../domain/ValidationService';
import { NeuralNetworkController } from '../interface-controller/NeuralNetworkController';
import { KNNController } from '../interface-controller/KNNController';
import type { KNNSettingsService } from '../domain/KNNSettingsService';
import { RecordingController } from '../interface-controller/RecordingController';
import { FilterController } from '../interface-controller/FilterController';
import type { RecordingService } from '../domain/RecordingService';

export class MLMachineControllers {
  private gestureController: GestureController;
  private dataController: DataController;
  private notificationController: NotificationController;

  public constructor(
    private mlMachine: MLMachine,
    private dataService: DataService,
    private notificationService: NotificationService,
    private featureService: FeatureService,
    private outputService: OutputService,
    private states: AbstractStates,
    private microbitService: MicrobitService,
    private validationService: ValidationService,
    private knnSettingsService: KNNSettingsService,
    private recordingService: RecordingService
  ) {
    this.gestureController = new GestureController(
      states,
      this.mlMachine.getGestureService(),
      mlMachine.getConfidenceService(),
    );
    this.dataController = new DataController(dataService, states);
    this.notificationController = new MLMachineNotificationController(
      this.notificationService,
      states,
    );
  }

  public getAppController(): AppController {
    return new MLMachineAppController(
      this.mlMachine.getDevices(),
      new UserServiceImpl(new LocalStorageUserSessionRepository()),
      this.featureService,
    );
  }

  public getFilterController() {
    return new FilterController(this.states, this.dataService);
  }

  public getKnnController(): KNNController {
    return new KNNController(this.states, this.knnSettingsService);
  }

  public getNotificationController(): NotificationController {
    console.log(this.notificationController);
    return this.notificationController;
  }

  public getNeuralNetworkController(): NeuralNetworkController {
    return new NeuralNetworkController(
      this.states,
      this.mlMachine.getClassifierService(),
    );
  }

  public getClassifierController(): ClassifierController {
    return new ClassifierController(this.states, this.mlMachine);
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

  public getValidationController() {
    return new ValidationController(
      this.validationService,
      this.dataService,
      this.states,
    );
  }

  public getRecordingController() {
    return new RecordingController(this.recordingService, this.states);
  }
}
