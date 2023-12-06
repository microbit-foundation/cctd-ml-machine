/**
 * Smoothes values by interpolating between old value and new value
 */
export const smoothNewValue = (oldValue: number, newValue: number) => {
  return newValue * 0.25 + oldValue * 0.75;
};
