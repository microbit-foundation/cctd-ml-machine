/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Axis } from '../../entities/Axis';
import type { SerializedSample } from './SerializedSample';

export interface SerializedRecording {
  ID: number;
  samples: SerializedSample[];
  axes: Axis[];
}
