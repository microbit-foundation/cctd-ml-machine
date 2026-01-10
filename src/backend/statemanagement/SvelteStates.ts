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
import { MicrobitRole } from '../domain/microbit/MicrobitRole';
import type { MicrobitConnection } from '../domain/microbit/MicrobitConnection';
import { MicrobitConnectionImpl } from '../domain/implementation/microbit/MicrobitConnectionImpl';
import { MicrobitConnectionStateImpl } from '../domain/implementation/microbit/MicrobitConnectionStateImpl';
import { MicrobitReconnectStateImpl } from '../domain/implementation/microbit/MicrobitReconnectStateImpl';

export class SvelteStates implements AbstractStates {
  private outputTargetState: AbstractState<OutputTarget>;
  private liveDataState: AbstractState<LiveData<LiveDataVector>>;
  private microbitConnectionState: AbstractState<MicrobitConnection>;

  public constructor() {
    this.liveDataState = new LiveDataStateAdapter(
      StaticConfiguration.accelerometerLiveDataBufferSize,
    );
    this.outputTargetState = new SvelteStateAdapter(
      writable(OutputTarget.OUTPUT_MICROBIT),
    );
    this.microbitConnectionState = new SvelteStateAdapter<MicrobitConnection>(
      writable(
        new MicrobitConnectionImpl(
          new MicrobitConnectionStateImpl(false, false, false, false, false),
          new MicrobitConnectionStateImpl(false, false, false, false, false),
          new MicrobitReconnectStateImpl(false, MicrobitRole.INPUT),
          false,
        ),
      ),
    );
  }

  getMicrobitConnection(): AbstractState<MicrobitConnection> {
    return this.microbitConnectionState;
  }

  getLiveData(): AbstractState<LiveData<LiveDataVector>> {
    return this.liveDataState;
  }

  public getOutputTarget(): AbstractState<OutputTarget> {
    return this.outputTargetState;
  }
}
