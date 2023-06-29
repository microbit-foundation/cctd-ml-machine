import { writable, Writable, get, derived } from 'svelte/store';

export const Paths = {
  HOME: '/',
  DATA: 'data',
  TRAINING: 'training',
  MODEL: 'model',
  FILTERS: 'training/filters',
} as const;

export type PathType = (typeof Paths)[keyof typeof Paths];

export const currentPathPrivate: Writable<PathType> = writable(Paths.HOME);
export const currentPath = derived(currentPathPrivate, path => path);

export function navigate(path: PathType) {
  if (path === get(currentPath)) {
    return;
  }
  currentPathPrivate.set(path);
}
