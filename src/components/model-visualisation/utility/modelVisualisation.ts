import type { ModelLayer } from "../../../script/ml";
import { colorArray } from "../../../script/utils/colors";
import { AnimationLoop } from "./animationLoop";
import type { ModelInformation } from "./modelInformation";

export type IllustratedNode = {
  size: number;
  length: number;
  width: number;
  heightOffset: number;
  nodeColor: string;
  borderColor: string;
};

export type IllustratedModelOffset = {
  x: number;
  y: number;
  rotation: number;
}

export type IllustratedModelNode = {
  size: number;
}

export type IllustratedModel = {
  model: IllustratedModelNode;
  modelOffset: IllustratedModelOffset;
  inputs: IllustratedNode[];
  outputs: IllustratedNode[];
};

export function getIllustratedModelFrom(
  modelLayers: ModelLayer[],
  modelInformation: ModelInformation) : IllustratedModel {
    return {
      model: getModelNodeFrom(modelInformation),
      modelOffset: getModelOffset(),
      inputs: getFilterValuesFrom(modelLayers, modelInformation),
      outputs: getOutputValuesFrom(modelLayers, modelInformation),
    }
}

export function getEmptyIllustratedModel() : IllustratedModel{
  const modelOffset : IllustratedModelOffset = {
    x: 0,
    y: 0,
    rotation: 0,
  };

  const model : IllustratedModelNode = {
    size: 2
  }

  return {
    modelOffset,
    model,
    inputs: [],
    outputs: [],
  }
}

export function getModelNodeFrom(modelInformation: ModelInformation) : IllustratedModelNode {
  const size = 2 + Math.min(modelInformation.energy, 350) / 50;

  return { size }
}

/**
 * Using modelInformation. Generate a model offset.
 * @param modelInformation current models information
 * @returns ModelInformation
 */
   export function getModelOffset(): IllustratedModelOffset {
    /** For now x, y, rotation are merely for aesthetic purposes */
    const x = Math.random() * 15 - 7.5;
    const y = Math.random() * 15 - 7.5;
    const rotation = Math.random() * 15 - 7.5;

    return {x, y, rotation};
  }

/**
 * Get normalized values inside of numbers array.
 * @param arr values 
 * @returns normalized values
 */
  function getNormalized(arr: number[]): number[] {
    const applier = 1 / Math.max(...arr);
    if(applier === Infinity) return arr.map(x => 0);
    return arr.map((x) => x * applier);
  }

  /**
   * Based on current modelInformation and layers within the current model
   * Get Illustrated nodes for Filter values.
   * @param modelLayers 
   * @param modelInformation 
   * @returns array of illustrated nodes for filters
   */
  export function getFilterValuesFrom(
    modelLayers: ModelLayer[],
    modelInformation: ModelInformation,
  ): IllustratedNode[] {
    const weights = modelLayers[0].weights;
    const modelPrecision = modelInformation.precision / 100;
    const mapColorIndex = (index) => {return Math.floor(index / 3) * 2;}

    return getIllustratedNodesFrom(weights, modelPrecision, mapColorIndex);
  }

  /**
   * Based on current modelInformation and layers within the current model
   * Get Illustrated nodes for output values.
   * @param modelLayers 
   * @param modelInformation 
   * @returns array of illustrated nodes for output values
   */
  export function getOutputValuesFrom(
    modelLayers: ModelLayer[],
    modelInformation: ModelInformation,
  ): IllustratedNode[] {
    const weights = modelLayers[1].weights;
    const modelPrecision = modelInformation.precision / 100;
    const mapColorIndex = (index) => {return index + 10;}

    return getIllustratedNodesFrom(weights, modelPrecision, mapColorIndex);
  }

  /**
   * Based on a flat array with weights, model precision and a map of colors,
   * generate illustratedNode values. 
   * @param weights 
   * @param modelPrecision 
   * @param mapColorIndex 
   * @returns 
   */
  function getIllustratedNodesFrom(weights: number[], modelPrecision: number, mapColorIndex: (index: number) => number): IllustratedNode[] {
    const summedWeights = sumWeights(weights, 16);
    const normalizedSummedWeights = getNormalized(summedWeights);

    const nodes : IllustratedNode[] = normalizedSummedWeights.map((normalizedSummedWeight, index) => {
      const size = normalizedSummedWeight * 0.8 + 0.2;

      return {
        size,
        length: 1 - size,
        width: 0.2 + modelPrecision * 0.3,
        heightOffset: 0,

        borderColor: colorArray[mapColorIndex(index)].f200,
        nodeColor: colorArray[mapColorIndex(index)].f300,
      };
    });

    return nodes;
  }

  /**
   * The flat array is turned back into its matrix, where each row is summed together
   * @param weights 
   * @param weightsPerParameter 
   * @returns an array of sums for each row of the original matrix
   */
  function sumWeights(weights: number[], weightsPerParameter: number): number[] {
    console.log("weights", Object.keys(weights).length);
    const amountOfParameters = Object.keys(weights).length / weightsPerParameter;
    console.log("amountOfParameters", amountOfParameters);
    const parameterSums : number[] = Array(amountOfParameters);
    // Extract values from thirdLayer
    for(let i = 0; i < amountOfParameters; i++){
      let startIndex = i * weightsPerParameter;
      
      parameterSums[i] = sliceAndSum(weights, startIndex, 16);
    }

    return parameterSums;
  }

  /**
   * From slice of array, calculate the sum of this
   * @param array of values that we want to calculate from
   * @param startIndex first index (including itself)
   * @param length amount of numbers to sum
   * @returns the sum of the specified range within the array
   */
  function sliceAndSum(array: number[], startIndex: number, length: number) : number {
    let sum = 0;
    const endIndex = startIndex + length;

    for (let i = startIndex;i < endIndex; i++) {
      sum += array[i];
    }
    return sum;
  }