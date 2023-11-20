interface MLModel {
  predict(filteredData: number[]): number[];
}

export default MLModel;
