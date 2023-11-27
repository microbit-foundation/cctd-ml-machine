import { Readable } from 'svelte/store';
import LiveDataBuffer from './LiveDataBuffer';

interface LiveData<T> extends Readable<T> {
  put(data: T): void;
  getBuffer(): LiveDataBuffer<T>;
}

export default LiveData;
