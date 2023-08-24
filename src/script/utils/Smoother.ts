/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

class Smoother {
  private sum: number;
  private smoothingPercentage: number;

  /**
   *
   * @param smoothingPercentage number between 0 and 1 dictating the percentage a number influences the smoothed number. The closer to 1, the stronger smoothing is applied. If number is outside of bounds, things will break.
   * @param initial initial value. Is not necessary.
   */
  constructor(smoothingPercentage: number, initial = 0) {
    if (1 <= smoothingPercentage || smoothingPercentage <= 0) {
      console.warn(
        `SmoothingPercentage cannot be set outside of bounds 0 to 1 (Including bounds). 
        Setting default bounds`,
      );
    }
    this.smoothingPercentage = Math.min(Math.max(smoothingPercentage, 0.001), 0.999);
    this.sum = initial;
  }

  /**
   * @return latest smoothed number
   */
  get latest(): number {
    return this.sum;
  }

  /**
   *
   * @param newNumber adds the new number. Applies smoothing in accordance to previous numbers
   * @returns the current number after smoothing
   */
  process(newNumber: number): number {
    this.sum =
      this.sum * this.smoothingPercentage + newNumber * (1 - this.smoothingPercentage);
    return this.latest;
  }
}

export default Smoother;
