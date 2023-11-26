import MLModel from '../domain/MLModel';

class NoneMLModel implements MLModel {
  predict(filteredData: number[]): Promise<number[]> {
    throw new Error('No model have been assigned. Make a new model!');
  }
}

export default NoneMLModel;
