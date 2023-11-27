import Filter from '../domain/Filter';

class ZeroCrossingRateFilter implements Filter {
  public filter(inValues: number[]): number {
    let count = 0;
    for (let i = 1; i < inValues.length; i++) {
      if (
        (inValues[i] >= 0 && inValues[i - 1] < 0) ||
        (inValues[i] < 0 && inValues[i - 1] >= 0)
      ) {
        count++;
      }
    }
    return count / (inValues.length - 1);
  }
}

export default ZeroCrossingRateFilter;
