import { IArrow } from "arrows-svg";
import { writable } from "svelte/store";

export const vectorArrows = writable<IArrow[]>([])