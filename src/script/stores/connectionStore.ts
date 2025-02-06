/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, type Writable } from 'svelte/store';
import { MBSpecs } from 'microbyte';
import PersistantWritable from '../repository/PersistantWritable';
// Todo: Rename file to a more appropriate name
// Pattern for connecting to input microbit
export const btPatternInput: Writable<boolean[]> = new PersistantWritable<boolean[]>(
  Array<boolean>(25).fill(false),
  'btPatternInput',
);

// Pattern for connecting to output microbit
export const btPatternOutput: Writable<boolean[]> = new PersistantWritable<boolean[]>(
  Array<boolean>(25).fill(false),
  'btPatternOutput',
);

export const isInputPatternValid = () => {
  const pattern = get(btPatternInput);
  return MBSpecs.Utility.isPairingPattermValid(pattern);
};
