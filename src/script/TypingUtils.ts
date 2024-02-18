/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Utility class for type annotation
 */
const TypingUtils = {
  /**
   * Used to denote explicitly empty functions as `() => {}`
   */
  emptyFunction: () => {
    /* Empty */
  },
};

export type Point3D = {
  x: number;
  y: number;
  z: number;
};
/**
 * Type help for d3-3d package
 */
export type Point3DTransformed = Point3D & {
  rotated: { x: number; y: number; z: number };
  projected: { x: number; y: number };
};

export default TypingUtils;
