/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from "svelte/store";
import ConsoleLogger, { welcomeLog } from "../../core/logging/ConsoleLogger";
import type { Logger } from "../../core/logging/Logger";
import Devices from "../../lib/domain/Devices";
import Snackbar from "../../lib/stores/Snackbar";
import type { AbstractState } from "../application/data/AbstractState";
import type { DevicesType } from "../application/devices/Devices";
import { StateNotificationService } from "../application/notification/StateNotificationService";
import type { NotificationService } from "../domain/NotificationService";
import { MLMachineControllers } from "./MLMachineControllers";
import { SvelteStateAdapter } from "./SvelteStateAdapter";


/**
 * Acts as the main bootstrapping object. Is initialized once and shared across the UI
 * This can be polluted by UI-specific elements and bridges the backend and frontend.
 * Singleton class
 */
export class MLMachine {
    private devices: AbstractState<DevicesType>;
    private immediateFeedback: AbstractState<string | undefined>;
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
        this.devices = new SvelteStateAdapter(new Devices());
        this.immediateFeedback = new SvelteStateAdapter(
            writable<string | undefined>(undefined)
        );
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

    public createLogger(origin: any): Logger {
        return new ConsoleLogger(origin)
    }

    public getControllers(): MLMachineControllers {
        return new MLMachineControllers(this);
    }
}
