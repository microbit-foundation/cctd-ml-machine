import Filter from '../domain/Filter';

class MaxFilter implements Filter {
  filter(inValues: number[]): number {
    return Math.max(...inValues);
  }
}
export default MaxFilter;
