import { Readable } from 'svelte/store';

export type EngineData = {
  isRunning: boolean;
};

interface Engine extends Readable<EngineData> {
  start(): void;
  stop(): void;
}

export default Engine;
