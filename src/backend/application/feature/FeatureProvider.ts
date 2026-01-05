import type { FeatureValue } from './FeatureValue';
import type { Feature } from './Feature';

export interface FeatureProvider {
  getFeature<T>(feature: Feature): FeatureValue<T>;
}
