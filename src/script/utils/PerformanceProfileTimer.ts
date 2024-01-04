/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Dev tool, use it to quickly determine how long actions take, example
 *
 * ```
 * const perId = Date.now();
 * PerformanceProfileTimer.start(perId.toString());
 *
 * doDemandingStuff();
 *
 * PerformanceProfileTimer.stop(perId.toString());
 * ```
 */
class PerformanceProfileTimer {
  private static timerMap: Map<string, number> = new Map();
  public static start(id: string) {
    PerformanceProfileTimer.timerMap.set(id, Date.now());
  }

  public static stop(id: string) {
    if (!PerformanceProfileTimer.timerMap.has(id)) {
      throw new Error('Timer wasnt started! You must call start first with the same id!');
    }
    console.log(Date.now() - PerformanceProfileTimer.timerMap.get(id)!);
  }
}

export default PerformanceProfileTimer;
