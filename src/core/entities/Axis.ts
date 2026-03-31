/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export type Axis = {
  index: number;
  label: string;
};

export const strArrToAxisArr = (strArr: string[]): Axis[] => {
  return strArr.map((label, index) => ({ index, label }));
};
