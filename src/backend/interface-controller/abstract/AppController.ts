/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Application } from "../../../core/Application";
import type { AbstractState } from "../../application/data/AbstractState";
import type { DevicesType } from "../../application/devices/Devices";

export interface AppController extends Application {
    getDocumentTitle(): string;
    // TODO; Should be a domain entity, but it's too large for refactoring now
    getDevices(): AbstractState<DevicesType>
    isReconnectFlagSet(): boolean;
    unsetReconnectFlag(): void;
}
