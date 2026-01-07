/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureProvider } from '../application/feature/FeatureProvider';
import { Feature } from '../application/feature/Feature';
import { StringFeature } from '../application/feature/StringFeature';
import { BooleanFeature } from '../application/feature/BooleanFeature';
import { NumberFeature } from '../application/feature/NumberFeature';
import type { FeatureValue } from '../application/feature/FeatureValue';

// Import the JSON file at the project root. tsconfig has `resolveJsonModule` enabled.
import features from '../../../features.json';

export class JSONFileFeatureProvider implements FeatureProvider {
  private readonly featureMap: Record<string, any>;

  public constructor(featureMap?: Record<string, any>) {
    this.featureMap = featureMap ?? (features as any);
  }

  public getFeature<T>(feature: Feature): FeatureValue<T> {
    let value: FeatureValue<any>;

    switch (feature) {
      case Feature.TITLE:
        value = new StringFeature(this.featureMap.title);
        break;
      case Feature.KNN_MODEL:
        value = new BooleanFeature(this.featureMap.knnModel);
        break;
      case Feature.LOSS_GRAPH:
        value = new BooleanFeature(this.featureMap.lossGraph);
        break;
      case Feature.MAKECODE:
        value = new BooleanFeature(this.featureMap.makecode);
        break;
      case Feature.LIVE_GRAPH_INPUT_VALUES:
        value = new BooleanFeature(this.featureMap.liveGraphInputValues);
        break;
      case Feature.RECORDING_SCRUBBER_VALUES:
        value = new BooleanFeature(this.featureMap.recordingScrubberValues);
        break;
      case Feature.MODEL_VALIDATION:
        value = new BooleanFeature(this.featureMap.modelValidation);
        break;
      case Feature.MODEL_SETTINGS:
        value = new BooleanFeature(this.featureMap.modelSettings);
        break;
      case Feature.FINGERPRINT:
        value = new BooleanFeature(this.featureMap.fingerprint);
        break;
      case Feature.RECORDING_DURATION:
        value = new NumberFeature(this.featureMap.recordingDuration);
        break;
      case Feature.PRINTABLE_RECORDINGS:
        value = new BooleanFeature(this.featureMap.printableRecordings);
        break;
      case Feature.DIALOG_RECORDINGS:
        value = new BooleanFeature(this.featureMap.dialogRecordings);
        break;
      default:
        // Unknown features are a programmer error — throw so it's caught early.
        throw new Error(`Unknown feature: ${Feature[feature] ?? feature}`);
    }

    return value as FeatureValue<T>;
  }
}
