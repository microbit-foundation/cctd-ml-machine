/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { type Readable } from 'svelte/store';

export type EngineData = {
  isRunning: boolean;
};

export interface Engine extends Readable<EngineData> {
  start(): void;
  stop(): void;
}
