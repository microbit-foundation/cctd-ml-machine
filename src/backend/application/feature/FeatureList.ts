/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  createFeatureToken,
  type FeatureToken,
} from '../../../core/featureprovider/FeatureToken';
import featureJson from '../../../../features.json';

type Features = typeof featureJson;
type JSONFeatureKeys = keyof Features;

const _featureNames = Object.keys(featureJson) as JSONFeatureKeys[];

export const featureList: { [K in JSONFeatureKeys]: FeatureToken<Features[K]> } =
  _featureNames.reduce(
    (acc, k, i) => {
      (acc as any)[k] = createFeatureToken<JSONFeatureKeys, Features[typeof k]>(
        String(k) as JSONFeatureKeys,
      );
      return acc;
    },
    {} as { [K in JSONFeatureKeys]: FeatureToken<Features[K]> },
  );

const featureValues = featureJson;

export { featureValues };
