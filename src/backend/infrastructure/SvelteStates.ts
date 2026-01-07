/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { AbstractState } from '../interface-adapter/AbstractState';
import { SvelteStateAdapter } from '../interface-adapter/SvelteStateAdapter';
import type { AbstractStates } from './AbstractStates';

export class SvelteStates implements AbstractStates {
  private outputTargetState: AbstractState<OutputTarget>;

  public constructor() {
    this.outputTargetState = new SvelteStateAdapter(
      writable(OutputTarget.OUTPUT_MICROBIT),
    );
  }

  public getOutputTarget(): AbstractState<OutputTarget> {
    return this.outputTargetState;
  }
}
