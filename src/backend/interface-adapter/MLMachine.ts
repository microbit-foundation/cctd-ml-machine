/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import ConsoleLogger, { welcomeLog } from '../../core/logging/ConsoleLogger';
import type { Logger } from '../../core/logging/Logger';
import Devices from '../../lib/domain/Devices';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { DevicesType } from '../application/devices/Devices';
import { StateNotificationService } from '../domain/implementation/notification/StateNotificationService';
import type { NotificationService } from '../domain/NotificationService';
import { MLMachineControllers } from './MLMachineControllers';
import { SvelteStateAdapter } from '../statemanagement/SvelteStateAdapter';
import type { ClassifierService } from '../domain/ClassifierService';
import { StateClassifierService } from '../domain/implementation/classifier/StateClassifierService';
import { DefaultNeuralNetworkModelBaseSettings } from './DefaultNeuralNetworkModelBaseSettings';
import { NeuralNetworkSettingsImpl } from '../../core/model/neural-network/NeuralNetworkSettingsImpl';
import { LoggingNeuralNetworkTrainingObserver } from '../../core/model/neural-network/LoggingNeuralNetworkTrainingObserver';
import { NeuralNetworkSettingsStateAdapter } from './NeuralNetworkSettingsStateAdapter';
import { DefaultNeuralNetworkArchitecture } from './DefaultNeuralNetworkArchitecture';
import type { Classifier } from '../../core/classifier/Classifier';
import type { ModelTraining } from '../../core/model/ModelTraining';
import { ModelTrainingStateAdapter } from './ModelTrainingStateAdapter';
import { DataServiceImpl } from '../application/data/DataServiceImpl';
import type { GestureService } from '../domain/GestureService';
import { GestureServiceImpl } from '../domain/implementation/gesture/GestureServiceImpl';
import { LocalStorageGestureRepository } from '../infrastructure/LocalStorageGestureRepository';
import { MLMachineColors } from './MLMachineColors';
import type { DataService } from '../domain/DataService';
import { StatesAxisRepository } from '../infrastructure/StatesAxisRepository';
import { InMemoryLiveDataRepository } from '../infrastructure/StatesLiveDataRepository';
import { NotifierServiceImpl } from '../application/NotifierServiceImpl';
import type { FeatureProvider } from '../application/feature/FeatureProvider';
import { FeatureServiceImpl } from '../application/feature/FeatureServiceImpl';
import type { FeatureService } from '../application/feature/FeatureService';
import { JSONFileFeatureProvider } from './JSONFileFeatureProvider';
import { OutputServiceImpl } from '../domain/implementation/output/OutputServiceImpl';
import type { AbstractStates } from '../statemanagement/AbstractStates';
import { SvelteStates } from '../statemanagement/SvelteStates';
import { StatesOutputRepository } from '../infrastructure/StatesOutputRepository';
import type { MicrobitService } from '../domain/microbit/MicrobitService';
import { MicrobitServiceImpl } from '../domain/implementation/microbit/MicrobitServiceImpl';
import { StatesMicrobitConnectionRepository } from '../infrastructure/StatesMicrobitConnectionRepository';
import { UserServiceImpl } from '../domain/implementation/UserServiceImpl';
import { LocalStorageUserSessionRepository } from '../infrastructure/LocalStorageUserSessionRepository';
import type { UserService } from '../domain/UserService';
import { StatesNotificationRepository } from '../infrastructure/StatesNotificationRepository';
import { StatesFilterRepository } from '../infrastructure/StatesFilterRepository';
import { ValidationServiceImpl } from '../domain/implementation/validation/ValidationServiceImpl';
import { StatesValidationRepository } from '../infrastructure/StatesValidationRepository';

/**
 * Acts as the main bootstrapping object. Is initialized once and shared across the UI
 * This can be polluted by UI-specific elements and bridges the backend and frontend.
 * Singleton class
 */
export class MLMachine {
  private devices: AbstractState<DevicesType>;
  private immediateFeedback: AbstractState<string | undefined>;
  private classifier: AbstractState<Classifier | undefined>;
  private modelTraining: AbstractState<ModelTraining>;
  private controllers: MLMachineControllers;
  private dataService: DataService;
  private gestureService: GestureService;
  private featureService: FeatureService;
  private states: AbstractStates;
  private microbitService: MicrobitService;
  private userService: UserService;
  private notificationService: NotificationService;
  private classifierService: ClassifierService;
  // TODO: Should probably be a logging factory taken as argument instead
  private log: Logger = new ConsoleLogger('MLMachine');

  private static instance: MLMachine = new MLMachine(new JSONFileFeatureProvider());

  public static getInstance(): MLMachine {
    return MLMachine.instance;
  }

  private constructor(private featureProvider: FeatureProvider) {
    this.log.log('Bootstrapped ML-Machine');
    const userSessionRepository = new LocalStorageUserSessionRepository();
    this.userService = new UserServiceImpl(userSessionRepository);
    this.states = new SvelteStates();

    this.devices = new SvelteStateAdapter(new Devices());
    this.immediateFeedback = new SvelteStateAdapter(
      writable<string | undefined>(undefined),
    );
    this.classifier = new SvelteStateAdapter(writable<Classifier | undefined>(undefined));
    this.modelTraining = new ModelTrainingStateAdapter();

    const repository = new LocalStorageGestureRepository(
      new ConsoleLogger('LocalStorageGestureRepository'),
    );
    this.featureService = new FeatureServiceImpl(featureProvider);
    this.gestureService = new GestureServiceImpl(
      new LocalStorageGestureRepository(
        new ConsoleLogger('LocalStorageGestureRepository'),
      ),
      new MLMachineColors(repository),
    );
    this.dataService = new DataServiceImpl(
      new StatesAxisRepository(this.gestureService, this.states),
      new InMemoryLiveDataRepository(this.states),
      new StatesFilterRepository(this.states),
      this.gestureService,
    );

    const outputService = new OutputServiceImpl(new StatesOutputRepository(this.states));
    const microbitConnectionRepository = new StatesMicrobitConnectionRepository(
      this.states,
    );
    this.microbitService = new MicrobitServiceImpl(
      microbitConnectionRepository,
      this.userService,
    );

    this.notificationService = new StateNotificationService(
      new StatesNotificationRepository(this.states),
    );

    const initialNeuralNetworkSettings = new NeuralNetworkSettingsImpl(
      new DefaultNeuralNetworkModelBaseSettings(),
      new DefaultNeuralNetworkArchitecture(),
      new LoggingNeuralNetworkTrainingObserver(
        this.createLogger('LoggingNeuralNetworkTrainingObserver'),
      ),
    );
    this.classifierService = new StateClassifierService(
      new NeuralNetworkSettingsStateAdapter(initialNeuralNetworkSettings),
      this.classifier,
      this.modelTraining,
    );
    this.controllers = new MLMachineControllers(
      this,
      this.dataService,
      this.notificationService,
      this.featureService,
      outputService,
      this.states,
      this.microbitService,
      new ValidationServiceImpl(
        this.classifierService,
        new StatesValidationRepository(this.states),
        this.dataService,
      ),
    );

    // const devices = stores.getDevices();
    // const outputHandler = new OutputMicrobitHandler(devices);
    /* Microbits.setHandlers(
            new CombinedMicrobitHandler(outputHandler, devices),
            outputHandler
        );*/
  }

  public init(): void {
    if (MLMachine.instance !== null) {
      this.log.warn('MLMachine was already instantiated, skipping');
    } else {
      MLMachine.instance = this;
    }
    welcomeLog();
  }

  public getDevices(): AbstractState<DevicesType> {
    return this.devices;
  }

  public getNotificationService(): NotificationService {
    return this.notificationService;
  }

  public getClassifierService(): ClassifierService {
    return this.classifierService;
  }

  public getDataService() {
    return this.dataService;
  }

  public getGestureService(): GestureService {
    return this.gestureService;
  }

  public createLogger(origin: any): Logger {
    return new ConsoleLogger(origin);
  }

  public getControllers(): MLMachineControllers {
    return this.controllers;
  }
}

export const getControllers = () => {
  return MLMachine.getInstance().getControllers();
};
