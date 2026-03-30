/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { Classifier } from '../../../../core/classifier/Classifier';
import type { ModelTraining } from '../../../../core/model/ModelTraining';
import type { NeuralNetworkModelSettings } from '../../../../core/model/neural-network/NeuralNetworkModelSettings';
import type { ClassifierRepository } from '../../ClassifierRepository';
import type { ClassifierService } from '../../ClassifierService';
import type { ModelTrainingStateRepository } from '../../ModelTrainingStateRepository';
import type { NeuralNetworkRepository } from '../../NeuralNetworkRepository';

export class ClassifierServiceImpl implements ClassifierService {
  // TODO: Remove dependency on abstract state. Move to a repository interface instead

  constructor(
    private classifierRepository: ClassifierRepository,
    private modelTraining: ModelTrainingStateRepository,
    private neuralNetworkRepository: NeuralNetworkRepository,
  ) { }

  public setNeuralNetworkSettings(neuralNetworkSettings: NeuralNetworkModelSettings): void {
    this.neuralNetworkRepository.setNeuralNetworkSettings(neuralNetworkSettings);
  }

  public unsetClassifier(): void {
    this.classifierRepository.setClassifier(undefined);
  }

  public getModelTraining(): ModelTraining {
    return this.modelTraining.getModelTraining();
  }

  public getClassifier(): Classifier | undefined {
    return this.classifierRepository.getClassifier();
  }

  public getNeuralNetworkSettings(): NeuralNetworkModelSettings {
    return this.neuralNetworkRepository.getNeuralNetworkSettings();
  }
}
