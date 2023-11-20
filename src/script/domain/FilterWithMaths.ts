import Filter from './Filter';

abstract class FilterWithMaths implements Filter {
  abstract filter(inValues: number[]): number;
  protected stddev(arr: number[]): number {
    const arr_mean = this.mean(arr);
    const r = function (acc: number, val: number) {
      return acc + (val - arr_mean) * (val - arr_mean);
    };
    return Math.sqrt(arr.reduce(r, 0.0) / arr.length);
  }

  protected mean(a: number[]): number {
    return a.reduce((acc, val) => acc + val) / a.length;
  }
}

export default FilterWithMaths;
