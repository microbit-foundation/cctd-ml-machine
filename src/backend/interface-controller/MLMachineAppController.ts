/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureProvider } from "../../core/featureprovider/FeatureProvider";
import { featureList, featureValues } from "../application/feature/FeatureList";
import { JSONFeatureProvider } from "../../core/featureprovider/JSONFeatureProvider";
import type { AppController } from "./abstract/AppController";
import type { AbstractState } from "../interface-adapter/AbstractState";
import type { DevicesType } from "../application/devices/Devices";

export class MLMachineAppController implements AppController {

    public constructor(
        private devices: AbstractState<DevicesType>,
        private reconnectFlag: AbstractState<boolean>
    ) { }

    public unsetReconnectFlag(): void {
        this.reconnectFlag.set(false);
    }

    public isReconnectFlagSet(): boolean {
        return this.reconnectFlag.get();
    }

    public getDevices(): AbstractState<DevicesType> {
        return this.devices;
    }
    public getDocumentTitle(): string {
        return this.getFeatureProvider().require(featureList.title);
    }
    public getFeatureProvider(): FeatureProvider {
        return new JSONFeatureProvider(featureValues);
    }
}
