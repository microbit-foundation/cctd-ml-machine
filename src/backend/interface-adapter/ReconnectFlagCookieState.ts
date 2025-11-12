/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import CookieManager from "../../lib/CookieManager";
import type { AbstractState, Unsubscriber } from "../domain/AbstractState";

export class ReconnectFlagCookieState implements AbstractState<boolean> {
    public get(): boolean {
        return CookieManager.isReconnectFlagSet();
    }

    public set(value: boolean): void {
        if (value === true) {
            CookieManager.setReconnectFlag();
        } else {
            CookieManager.unsetReconnectFlag();
        }
    }

    public update(updater: (curVal: boolean) => boolean): void {
        this.set(updater(this.get()));
    }

    public subscribe(run: (value: boolean) => void, invalidate?: (value?: boolean) => void): Unsubscriber {
        throw new Error("Subscriptions not supported for reconnect flag!");
    }
}
