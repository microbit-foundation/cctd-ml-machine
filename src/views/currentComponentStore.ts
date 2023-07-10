import { SvelteComponent } from 'svelte';
import { Writable, writable } from 'svelte/store';
import Homepage from '../pages/Homepage.svelte';

export const currentPageComponent: Writable<typeof SvelteComponent> = writable(Homepage);
