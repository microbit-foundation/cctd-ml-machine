/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable } from 'svelte/store';
import AccelerometerClassifierInput from '../../mlmodels/AccelerometerClassifierInput';

export type EngineData = {
  isRunning: boolean;
};

interface Engine extends Readable<EngineData> {
  start(): void;
  stop(): void;
  bufferToInput(): AccelerometerClassifierInput;
}

export default Engine;
