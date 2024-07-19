/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export type BluetoothPattern = boolean[];
const microbitNameLength = 5;

/**
 *  This is a version of the microbit codebook, where the original codebook is transposed
 *  and the rows are flipped. This gives an easier to use version for the bluetooth pattern
 *  connection.
 *  This could be done programatically, but having it typed out hopefully helps
 *  with the understanding of pattern <-> friendly name conversion
 */
const microbitBluetoothCodebook: string[][] = [
  ["t", "a", "t", "a", "t"],
  ["p", "e", "p", "e", "p"],
  ["g", "i", "g", "i", "g"],
  ["v", "o", "v", "o", "v"],
  ["z", "u", "z", "u", "z"],
];

const microbitNameToBluetoothPattern = (name: string): BluetoothPattern => {
  const pattern: BluetoothPattern = new Array<boolean>(25).fill(true);

  // if wrong name length, return empty pattern
  if (name.length != microbitNameLength) {
    return pattern.map(() => false);
  }

  for (let column = 0; column < microbitNameLength; column++) {
    for (let row = 0; row < microbitNameLength; row++) {
      if (microbitBluetoothCodebook[row][column] === name.charAt(column)) {
        break;
      }
      pattern[5 * row + column] = false;
    }
  }

  return pattern;
};

const deviceIdToNameCodebook = [
  ["z", "v", "g", "p", "t"],
  ["u", "o", "i", "e", "a"],
  ["z", "v", "g", "p", "t"],
  ["u", "o", "i", "e", "a"],
  ["z", "v", "g", "p", "t"],
];

const deviceIdToMicrobitName = (deviceId: number): string => {
  let d = microbitNameLength;
  let ld = 1;
  let name = "";

  for (let i = 0; i < microbitNameLength; i++) {
    const h = Math.floor((deviceId % d) / ld);
    deviceId -= h;
    d *= microbitNameLength;
    ld *= microbitNameLength;
    name = deviceIdToNameCodebook[i][h] + name;
  }
  return name;
};

export const deviceIdToBluetoothPattern = (
  deviceId: number
): BluetoothPattern => {
  const name = deviceIdToMicrobitName(deviceId);
  return microbitNameToBluetoothPattern(name);
};
