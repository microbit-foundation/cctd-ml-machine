import Filter from '../domain/Filter';
import FilterWithMaths from '../domain/FilterWithMaths';
import MeanFilter from './MeanFilter';

class StandardDeviationFilter extends FilterWithMaths {
  public filter(inValues: number[]): number {
    const mean = this.mean(inValues);
    return Math.sqrt(
      inValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / inValues.length,
    );
  }
}

export default StandardDeviationFilter;
