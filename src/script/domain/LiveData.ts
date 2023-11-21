import { Readable } from 'svelte/store';

interface LiveData<T> extends Readable<T> {
  put(data: T): void;
}

export default LiveData;
