/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { NeuralNetworkModelLearningSettings } from '../../core/model/neural-network/NeuralNetworkModelBaseSettings';

export class DefaultNeuralNetworkModelBaseSettings
  implements NeuralNetworkModelLearningSettings
{
  private learningRate: number;
  private numberOfEpochs: number;
  private batchSize: number;
  private validationSplit: number;

  constructor() {
    this.learningRate = 0.1;
    this.numberOfEpochs = 80;
    this.batchSize = 16;
    this.validationSplit = 0.1;
  }

  public getLearningRate(): number {
    return this.learningRate;
  }

  public setLearningRate(learningRate: number): void {
    this.learningRate = learningRate;
  }

  public getNumberOfEpochs(): number {
    return this.numberOfEpochs;
  }

  public setNumberOfEpochs(numberOfEpochs: number): void {
    this.numberOfEpochs = numberOfEpochs;
  }

  public getBatchSize(): number {
    return this.batchSize;
  }

  public setBatchSize(batchSize: number): void {
    this.batchSize = batchSize;
  }

  public getValidationSplit(): number {
    return this.validationSplit;
  }

  public setValidationSplit(validationSplit: number): void {
    this.validationSplit = validationSplit;
  }
}
