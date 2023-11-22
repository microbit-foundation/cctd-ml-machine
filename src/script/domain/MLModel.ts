interface MLModel {
  predict(filteredData: number[]): Promise<number[]>;
}

export default MLModel;
