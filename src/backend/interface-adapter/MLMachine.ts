/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from "svelte/store";
import ConsoleLogger, { welcomeLog } from "../../core/logging/ConsoleLogger";
import type { Logger } from "../../core/logging/Logger";
import Devices from "../../lib/domain/Devices";
import type { AbstractState } from "../domain/AbstractState";
import type { DevicesType } from "../application/devices/Devices";
import { StateNotificationService } from "../domain/implementation/notification/StateNotificationService";
import type { NotificationService } from "../domain/NotificationService";
import { MLMachineControllers } from "./MLMachineControllers";
import { SvelteStateAdapter } from "./SvelteStateAdapter";
import type { ClassifierService } from "../domain/ClassifierService";
import { StateClassifierService } from "../domain/implementation/classifier/StateClassifierService";
import { DefaultNeuralNetworkModelBaseSettings } from "./DefaultNeuralNetworkModelBaseSettings";
import { NeuralNetworkSettingsImpl } from "../../core/model/neural-network/NeuralNetworkSettingsImpl";
import { LoggingNeuralNetworkTrainingObserver } from "../../core/model/neural-network/LoggingNeuralNetworkTrainingObserver";
import { NeuralNetworkSettingsStateAdapter } from "./NeuralNetworkSettingsStateAdapter";
import { DefaultNeuralNetworkArchitecture } from "./DefaultNeuralNetworkArchitecture";
import type { Classifier } from "../../core/classifier/Classifier";
import type { ModelTraining } from "../../core/model/ModelTraining";
import { ModelTrainingStateAdapter } from "./ModelTrainingStateAdapter";
import { StateDataService } from "../domain/implementation/data/StateDataService";
import type { Axis } from "../../core/entities/Axis";
import type { GestureService } from "../domain/GestureService";
import { GestureServiceImpl } from "../domain/implementation/gesture/GestureServiceImpl";
import { LocalStorageGestureRepository } from "../infrastructure/LocalStorageGestureRepository";
import type { Gesture } from "../../core/entities/Gesture";


/**
 * Acts as the main bootstrapping object. Is initialized once and shared across the UI
 * This can be polluted by UI-specific elements and bridges the backend and frontend.
 * Singleton class
 */
export class MLMachine {
    private devices: AbstractState<DevicesType>;
    private immediateFeedback: AbstractState<string | undefined>;
    private classifier: AbstractState<Classifier | undefined>;
    private modelTraining: AbstractState<ModelTraining>
    private selectedAxes: AbstractState<Axis[]>
    private availableAxes: AbstractState<Axis[]>
    private controllers: MLMachineControllers;
    // TODO: Should probably be a logging factory taken as argument instead
    private log: Logger = new ConsoleLogger("MLMachine");

    private static instance: MLMachine | null = null;

    public static getInstance(): MLMachine {
        if (MLMachine.instance === null) {
            throw new Error("MLMachine hasn't been instantiated yet");
        }
        return MLMachine.instance;
    }

    public constructor() {
        this.log.log("Bootstrapped ML-Machine")
        this.devices = new SvelteStateAdapter(new Devices());
        this.immediateFeedback = new SvelteStateAdapter(
            writable<string | undefined>(undefined)
        );
        this.classifier = new SvelteStateAdapter(
            writable<Classifier | undefined>(undefined)
        )
        this.modelTraining = new ModelTrainingStateAdapter();

        const availableAxesFromRecordings = this.getAvailableAxesFromRecordings()
        this.availableAxes = new SvelteStateAdapter(writable<Axis[]>(
            availableAxesFromRecordings
        ))
        this.selectedAxes = new SvelteStateAdapter(writable<Axis[]>(
            availableAxesFromRecordings
        ))

        this.controllers = new MLMachineControllers(this);
    }

    public init(): void {
        if (MLMachine.instance !== null) {
            this.log.warn("MLMachine was already instantiated, skipping");
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
            new LoggingNeuralNetworkTrainingObserver(this.createLogger("LoggingNeuralNetworkTrainingObserver"))
        );
        return new StateClassifierService(
            new NeuralNetworkSettingsStateAdapter(initialNeuralNetworkSettings),
            this.classifier,
            this.modelTraining
        );
    }

    public getDataService() {
        return new StateDataService(
            this.selectedAxes
        );
    }

    public getGestureService(): GestureService {
        return new GestureServiceImpl(
            new LocalStorageGestureRepository(new ConsoleLogger("LocalStorageGestureRepository"))
        );
    }

    public createLogger(origin: any): Logger {
        return new ConsoleLogger(origin)
    }

    public getControllers(): MLMachineControllers {
        return this.controllers;
    }

    private getAvailableAxesFromRecordings(): Axis[] | undefined {
        const gestures: Gesture[] = this.getGestureService().getGestures()
        if (gestures.length > 0) {
            const recordings = gestures[0].getRecordings();
            if (recordings.length > 0) {
                this.log.log(
                    'Found default available axes in recordings',
                    recordings[0].labels,
                );
                return recordings[0].labels.map(
                    (label: string, index: number) =>
                        ({
                            index,
                            label,
                        }) as Axis,
                );
            }
        }
        return [];
    }
}

export const getControllers = () => {
    return MLMachine.getInstance().getControllers();
}