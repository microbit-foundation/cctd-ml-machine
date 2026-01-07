/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { MBSpecs } from 'microbyte';
import type { PinTurnOnState } from './PinTurnOnState';

export type SoundData = {
  name: string;
  id: string;
  path: string;
};

export type GestureOutput = {
  matrix?: boolean[];
  sound?: SoundData;
  outputPin?: { pin: MBSpecs.UsableIOPin; pinState: PinTurnOnState; turnOnTime: number };
};
