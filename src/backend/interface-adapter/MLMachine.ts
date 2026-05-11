/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import ConsoleLogger, { welcomeLog } from '../../core/logging/ConsoleLogger';
import type { Logger } from '../../core/logging/Logger';
import { StateNotificationService } from '../domain/implementation/notification/StateNotificationService';
import type { NotificationService } from '../domain/NotificationService';
import { MLMachineControllers } from './MLMachineControllers';
import type { ClassifierService } from '../domain/ClassifierService';
import { ClassifierServiceImpl } from '../domain/implementation/classifier/ClassifierServiceImpl';
import { DataServiceImpl } from '../application/data/DataServiceImpl';
import type { GestureService } from '../domain/GestureService';
import { GestureServiceImpl } from '../domain/implementation/gesture/GestureServiceImpl';
import { LocalStorageGestureRepository } from '../infrastructure/LocalStorageGestureRepository';
import { MLMachineColors } from './MLMachineColors';
import type { DataService } from '../domain/DataService';
import { StatesAxisRepository } from '../infrastructure/StatesAxisRepository';
import { StatesLiveDataRepository } from '../infrastructure/StatesLiveDataRepository';
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
import { StatesNeuralNetworkSettingsRepository } from '../infrastructure/StatesNeuralNetworkSettingsRepository';
import { StatesModelTrainingStateRepository } from '../infrastructure/StatesModelTrainingStateRepository';
import { StatesClassifierRepository } from '../infrastructure/StatesClassifierRepository';
import { StatesKNNModelSettingsRepository } from '../infrastructure/StatesKNNModelSettingsRepository';
import type { KNNSettingsService } from '../domain/KNNSettingsService';
import { KNNSettingsServiceImpl } from '../domain/implementation/KNNSettingsServiceImpl';
import { StatesTrainingIterationRepository } from '../infrastructure/StatesTrainingIterationRepository';
import { PollingPredictorEngine } from '../application/PollingPredictorEngine';
import StaticConfiguration from '../../StaticConfiguration';
import { ConfidenceServiceImpl } from '../domain/implementation/ConfidenceServiceImpl';
import { StatesConfidenceRepository } from '../infrastructure/StatesConfidenceRepository';
import type { ConfidenceService } from '../domain/ConfidenceService';
import { RecordingServiceImpl } from '../domain/implementation/RecordingServiceImpl';
import { StatesRecordingStateRepository } from '../infrastructure/StatesRecordingStateRepository';
import { StatesRecordingSettingsRepository } from '../infrastructure/StatesRecordingSettingsRepository';
import { SvelteStateAdapter } from '../statemanagement/SvelteStateAdapter';
import { writable } from 'svelte/store';
import type { NewGesture } from '../../core/entities/NewGesture';
import type { Axis } from '../../core/entities/Axis';
import type { AxisRepository } from '../domain/AxisRepository';

/**
 * Acts as the main bootstrapping object. Is initialized once and shared across the UI
 * This can be polluted by UI-specific elements and bridges the backend and frontend.
 * Singleton class
 */
export class MLMachine {
  private controllers: MLMachineControllers;
  private dataService: DataService;
  private gestureService: GestureService;
  private featureService: FeatureService;
  private states: AbstractStates;
  private microbitService: MicrobitService;
  private userService: UserService;
  private notificationService: NotificationService;
  private classifierService: ClassifierService;
  private knnSettingsService: KNNSettingsService;
  private engine: PollingPredictorEngine;
  private confidenceService: ConfidenceService;
  private filterRepository: StatesFilterRepository;
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

    const selectedGestureState = new SvelteStateAdapter(writable(undefined));
    const gestureRepository = new LocalStorageGestureRepository(
      new ConsoleLogger('LocalStorageGestureRepository'),
      gestures => this.states.setGestures(gestures),
      selectedGestureState,
    );
    this.states = new SvelteStates(
      gestureRepository.getGestures(),
      featureProvider,
      selectedGestureState,
      gestureRepository.getAxesFromGestures()
    );
    const confidenceRepository = new StatesConfidenceRepository(this.states);
    this.featureService = new FeatureServiceImpl(featureProvider);
    const axisRepository: AxisRepository = new StatesAxisRepository(gestureRepository, this.states);
    const neuralNetworkSettingsRepository = new StatesNeuralNetworkSettingsRepository(
      this.states.getNeuralNetworkSettings(),
    );
    this.filterRepository = new StatesFilterRepository(this.states);
    this.gestureService = new GestureServiceImpl(
      gestureRepository,
      new MLMachineColors(gestureRepository),
      axisRepository,
      neuralNetworkSettingsRepository,
      this.filterRepository,
    );
    this.confidenceService = new ConfidenceServiceImpl(
      confidenceRepository,
      this.gestureService,
    );
    this.dataService = new DataServiceImpl(
      axisRepository,
      new StatesLiveDataRepository(this.states),
      this.filterRepository,
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

    const statesModelTrainingRepository = new StatesModelTrainingStateRepository(
      this.states.getModelTraining(),
    );
    const classifierRepository = new StatesClassifierRepository(this.states);
    const knnSettingsRepository = new StatesKNNModelSettingsRepository(this.states);
    const trainingIterationRepository = new StatesTrainingIterationRepository(
      this.states,
    );
    this.knnSettingsService = new KNNSettingsServiceImpl(
      knnSettingsRepository,
      this.gestureService,
    );
    this.classifierService = new ClassifierServiceImpl(
      classifierRepository,
      statesModelTrainingRepository,
      neuralNetworkSettingsRepository,
      this.dataService,
      this.knnSettingsService,
      trainingIterationRepository,
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
      this.knnSettingsService,
      new RecordingServiceImpl(
        new StatesRecordingStateRepository(this.states),
        new StatesRecordingSettingsRepository(this.states),
        this.gestureService,
        this.dataService,
      ),
      this.classifierService,
    );

    const confidenceService = new ConfidenceServiceImpl(
      confidenceRepository,
      this.gestureService,
    );

    this.engine = new PollingPredictorEngine(
      this.classifierService,
      this.dataService,
      confidenceService,
      gestureRepository,
      StaticConfiguration.pollingPredictionInterval,
      StaticConfiguration.pollingPredictionSampleSize,
      StaticConfiguration.pollingPredictionInterval,
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

  getConfidenceService(): ConfidenceService {
    return this.confidenceService;
  }
}

export const getControllers = () => {
  return MLMachine.getInstance().getControllers();
};
