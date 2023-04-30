import { type Writable } from "svelte/store";
import { persistantWritable } from "./storeUtil";
// Todo: Rename file to a more appropriate name
// Pattern for connecting to input microbit
export const btPatternInput: Writable<boolean[]> =
	persistantWritable<boolean[]>("btPatternInput", Array<boolean>(25).fill(false));

// Pattern for connecting to output microbit
export const btPatternOutput: Writable<boolean[]> =
	persistantWritable<boolean[]>("btPatternOutput", Array<boolean>(25).fill(false));