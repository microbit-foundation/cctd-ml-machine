import { writable } from "svelte/store";
import { DrawablePoint } from "./KNNModelGraphDrawer";

export const knnHighlightedPoint = writable<DrawablePoint | undefined>(undefined)