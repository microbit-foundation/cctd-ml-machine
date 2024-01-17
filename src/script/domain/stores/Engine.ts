/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable } from 'svelte/store';

export type EngineData = {
  isRunning: boolean;
};

interface Engine extends Readable<EngineData> {
  start(): void;
  stop(): void;
}

export default Engine;
