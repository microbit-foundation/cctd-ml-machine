import { validateHeaderName } from 'http';
import Filter from '../domain/Filter';

class MinFilter implements Filter {
  public filter(inValues: number[]): number {
    return Math.min(...inValues);
  }
}

export default MinFilter;
