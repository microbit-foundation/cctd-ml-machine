import { writable, Writable, get } from 'svelte/store';

export const Paths = {
  HOME: '/',
  DATA: 'data',
  TRAINING: 'training',
  MODEL: 'model',
  FILTERS: 'filters',
} as const;

export type PathType = (typeof Paths)[keyof typeof Paths];

export const currentPath: Writable<PathType> = writable(Paths.HOME);

export function navigate(path: PathType) {
  if (path === get(currentPath)) {
    return;
  }
  currentPath.set(path);
}
