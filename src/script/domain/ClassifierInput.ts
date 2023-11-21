import Filters from './Filters';

interface ClassifierInput {
  getInput(filters: Filters): number[];
}

export default ClassifierInput;
