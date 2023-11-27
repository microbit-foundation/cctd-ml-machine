import Filter from '../domain/Filter';

class RootMeanSquareFilter implements Filter {
  public filter(inValues: number[]): number {
    return Math.sqrt(inValues.reduce((a, b) => a + Math.pow(b, 2), 0) / inValues.length);
  }
}

export default RootMeanSquareFilter;
