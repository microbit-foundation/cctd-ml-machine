/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import features from '../../features.json';

export enum Feature {
  KNN_MODEL = 'knnModel',
  TITLE = 'title',
}

export const hasFeature = (feature: Feature): boolean => {
  const featuresListedInJson = Object.getOwnPropertyNames(features);
  if (!featuresListedInJson.includes(feature.toString())) {
    throw new Error(
      'Attempted to check for feature, which did not exist in features.json',
    );
  }

  const entries = Object.entries(features as { [s: string]: any });
  const toggles = new Map<string, any>(entries);
  return !!toggles.get(feature.toString());
};

export const getFeature = <T>(feature: Feature): T => {
  const featuresListedInJson = Object.getOwnPropertyNames(features);

  if (!featuresListedInJson.includes(feature.toString())) {
    throw new Error(
      'Attempted to check for feature, which did not exist in features.json',
    );
  }
  const entries = Object.entries(features as { [s: string]: any });

  const toggles = new Map<string, any>(entries);
  return toggles.get(feature.toString()) as T;
};
