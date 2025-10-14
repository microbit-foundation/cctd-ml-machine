/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import CookieManager from "../../lib/CookieManager";
import type { AbstractState } from "../application/data/AbstractState";
import type { AppController } from "../interface-controller/abstract/AppController";
import type { NotificationController } from "../interface-controller/abstract/NotificationsController";
import { MLMachineAppController } from "../interface-controller/MLMachineAppController";
import { MLMachineNotificationController } from "../interface-controller/MLMachineNotificationController";
import { MLMachine } from "./MLMachine";

export class MLMachineControllers {
    public constructor(private mlMachine: MLMachine) { }

    public getAppController(): AppController {
        return new MLMachineAppController(
            this.mlMachine.getDevices(),
            this.getReconnectFlag(),
        )
    }

    public getNotificationController(): NotificationController {
        return new MLMachineNotificationController(this.mlMachine.getNotificationService())
    }

    private getReconnectFlag(): AbstractState<boolean> {
        const setter = (value: boolean) => {
                if (value === true) {
                    CookieManager.setReconnectFlag();
                } else {
                    CookieManager.unsetReconnectFlag();
                }
            }
        return {
            get: () => CookieManager.isReconnectFlagSet(),
            set: setter,
            update: (updater: (curVal: boolean) => boolean) => {
                setter(updater(CookieManager.isReconnectFlagSet()))
            },
            subscribe: () => {
                throw new Error("Subscriptions not supported for reconnect flag!");
            }
        }
    }
}