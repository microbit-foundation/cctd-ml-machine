/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import ConsoleLogger, { welcomeLog } from '../../core/logging/ConsoleLogger';
import type { Logger } from '../../core/logging/Logger';
import Devices from '../../lib/domain/Devices';
import type { AbstractState } from './AbstractState';
import type { DevicesType } from '../application/devices/Devices';
import { StateNotificationService } from '../domain/implementation/notification/StateNotificationService';
import type { NotificationService } from '../domain/NotificationService';
import { MLMachineControllers } from './MLMachineControllers';
import { SvelteStateAdapter } from './SvelteStateAdapter';
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
import type { Axis } from '../../core/entities/Axis';
import type { GestureService } from '../domain/GestureService';
import { GestureServiceImpl } from '../domain/implementation/gesture/GestureServiceImpl';
import { LocalStorageGestureRepository } from '../infrastructure/LocalStorageGestureRepository';
import type { Gesture } from '../../core/entities/Gesture';
import { MLMachineColors } from './MLMachineColors';
import type { DataService } from '../domain/DataService';
import { InMemoryAxisRepository } from '../infrastructure/InMemoryAxisRepository';
import { InMemoryLiveDataRepository } from '../infrastructure/InMemoryLiveDataRepository';
import StaticConfiguration from '../../StaticConfiguration';
import { NotifierServiceImpl } from '../application/NotifierServiceImpl';
import Microbits from '../../lib/microbit-interfacing/Microbits';
import CombinedMicrobitHandler from '../../lib/microbit-interfacing/CombinedMicrobitHandler';
import OutputMicrobitHandler from '../../lib/microbit-interfacing/OutputMicrobitHandler';
import { stores } from '../../lib/stores/Stores';
import type { LiveData } from '../../lib/domain/stores/LiveData';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { AbstractReadonlyState } from './AbstractReadonlyState';
import { InMemoryLiveDataStore } from '../../core/InMemoryLiveDataStore';
import { LiveDataStateAdapter } from './LiveDataStateAdapter';

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
  private liveData: AbstractState<LiveData<LiveDataVector>>;
  // TODO: Should probably be a logging factory taken as argument instead
  private log: Logger = new ConsoleLogger('MLMachine');

  private static instance: MLMachine | null = null;

  public static getInstance(): MLMachine {
    if (MLMachine.instance === null) {
      throw new Error("MLMachine hasn't been instantiated yet");
    }
    return MLMachine.instance;
  }

  public constructor() {
    this.log.log('Bootstrapped ML-Machine');
    this.devices = new SvelteStateAdapter(new Devices());
    this.immediateFeedback = new SvelteStateAdapter(
      writable<string | undefined>(undefined),
    );
    this.classifier = new SvelteStateAdapter(writable<Classifier | undefined>(undefined));
    this.modelTraining = new ModelTrainingStateAdapter();

    const repository = new LocalStorageGestureRepository(
      new ConsoleLogger('LocalStorageGestureRepository'),
    );
    this.gestureService = new GestureServiceImpl(
      new LocalStorageGestureRepository(
        new ConsoleLogger('LocalStorageGestureRepository'),
      ),
      new MLMachineColors(repository),
    );
    this.liveData = new LiveDataStateAdapter();
    this.dataService = new DataServiceImpl(
      new InMemoryAxisRepository(this.gestureService),
      new InMemoryLiveDataRepository(
        StaticConfiguration.accelerometerLiveDataBufferSize,
        this.liveData,
      ),
      new NotifierServiceImpl(),
    );

    this.controllers = new MLMachineControllers(this, this.dataService, this.liveData);
    const devices = stores.getDevices();
    const outputHandler = new OutputMicrobitHandler(devices);
    /*Microbits.setHandlers(
            new CombinedMicrobitHandler(outputHandler, devices),
            outputHandler
        );*/
  }

  public init(): void {
    if (MLMachine.instance !== null) {
      this.log.warn('MLMachine was already instantiated, skipping');
      return;
    }
    welcomeLog();
    MLMachine.instance = this;
  }

  public getDevices(): AbstractState<DevicesType> {
    return this.devices;
  }

  public getNotificationService(): NotificationService {
    return new StateNotificationService(this.immediateFeedback);
  }

  public getClassifierService(): ClassifierService {
    const initialNeuralNetworkSettings = new NeuralNetworkSettingsImpl(
      new DefaultNeuralNetworkModelBaseSettings(),
      new DefaultNeuralNetworkArchitecture(),
      new LoggingNeuralNetworkTrainingObserver(
        this.createLogger('LoggingNeuralNetworkTrainingObserver'),
      ),
    );
    return new StateClassifierService(
      new NeuralNetworkSettingsStateAdapter(initialNeuralNetworkSettings),
      this.classifier,
      this.modelTraining,
    );
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
