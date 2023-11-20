import Filters from './Filters';
import MLModel from './MLModel';

export type MLModelSettings = {
  axes: Axes[];
  filters: Filters;
};

interface MLModelFactory<T extends MLModel> {
  buildModel(settings: MLModelSettings): T;
}

export default MLModelFactory;
