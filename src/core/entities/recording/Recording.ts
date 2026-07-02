/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import type { Axis } from '../Axis';
import type { Sample } from './Sample';

export interface Recording {
  getId(): number;
  getSamples(): Sample[];
  getAxes(): Axis[];
}
