/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AppController } from "../interface-controller/abstract/AppController";
import type { NotificationController } from "../interface-controller/abstract/NotificationsController";
import { AxisController } from "../interface-controller/AxisController";
import { ClassifierController } from "../interface-controller/ClassifierController";
import { GestureController } from "../interface-controller/GestureController";
import { MLMachineAppController } from "../interface-controller/MLMachineAppController";
import { MLMachineNotificationController } from "../interface-controller/MLMachineNotificationController";
import { GesturesStateAdapter } from "./GesturesStateAdapter";
import { MLMachine } from "./MLMachine";
import { ReconnectFlagCookieState } from "./ReconnectFlagCookieState";

export class MLMachineControllers {

    private gestureController: GestureController;

    public constructor(private mlMachine: MLMachine) {
        this.gestureController = new GestureController(
            new GesturesStateAdapter(this.mlMachine.getGestureService()),
            this.mlMachine.getGestureService()
        );
    }

    public getAppController(): AppController {
        return new MLMachineAppController(
            this.mlMachine.getDevices(),
            new ReconnectFlagCookieState(),
        )
    }

    public getNotificationController(): NotificationController {
        return new MLMachineNotificationController(this.mlMachine.getNotificationService())
    }

    public getClassifierController(): ClassifierController {
        return new ClassifierController(this.mlMachine);
    }

    public getAxisController(): AxisController {
        return new AxisController(this.mlMachine);
    }

    public getGestureController() {
        return this.gestureController;
    }
}