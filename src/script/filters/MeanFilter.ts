import Filter from '../domain/Filter';
import FilterWithMaths from '../domain/FilterWithMaths';

class MeanFilter extends FilterWithMaths {
  public filter(inValues: number[]): number {
    return this.mean(inValues);
  }
}

export default MeanFilter;
