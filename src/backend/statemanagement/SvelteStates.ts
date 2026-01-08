/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { writable } from 'svelte/store';
import { OutputTarget } from '../domain/implementation/output/OutputTarget';
import type { AbstractState } from './AbstractState';
import { SvelteStateAdapter } from './SvelteStateAdapter';
import type { AbstractStates } from './AbstractStates';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { LiveData } from '../../lib/domain/stores/LiveData';
import { LiveDataStateAdapter } from '../interface-adapter/LiveDataStateAdapter';
import StaticConfiguration from '../../StaticConfiguration';

export class SvelteStates implements AbstractStates {
  private outputTargetState: AbstractState<OutputTarget>;
  private liveDataState: AbstractState<LiveData<LiveDataVector>>;

  public constructor() {
    this.liveDataState = new LiveDataStateAdapter(
      StaticConfiguration.accelerometerLiveDataBufferSize,
    );
    this.outputTargetState = new SvelteStateAdapter(
      writable(OutputTarget.OUTPUT_MICROBIT),
    );
  }
  getLiveData(): AbstractState<LiveData<LiveDataVector>> {
    return this.liveDataState;
  }

  public getOutputTarget(): AbstractState<OutputTarget> {
    return this.outputTargetState;
  }
}
