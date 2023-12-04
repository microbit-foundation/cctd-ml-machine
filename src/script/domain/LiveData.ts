/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable } from 'svelte/store';
import LiveDataBuffer from './LiveDataBuffer';

interface LiveData<T> extends Readable<T> {
  put(data: T): void;
  getBuffer(): LiveDataBuffer<T>;
}

export default LiveData;
