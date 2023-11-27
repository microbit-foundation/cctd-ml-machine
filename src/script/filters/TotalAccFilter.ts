import Filter from '../domain/Filter';

class TotalAccFilter implements Filter {
  public filter(inValues: number[]): number {
    return inValues.reduce((a, b) => a + Math.abs(b));
  }
}

export default TotalAccFilter;
