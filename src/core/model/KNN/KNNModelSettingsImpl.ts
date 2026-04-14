import type { KNNModelSettings } from './KNNModelSettings';

export class KNNModelSettingsImpl implements KNNModelSettings {
  constructor(
    private k: number,
    private numberOfClasses: number,
    private normalize: boolean,
  ) {}

  getK(): number {
    return this.k;
  }

  getNumberOfClasses(): number {
    return this.numberOfClasses;
  }

  shouldNormalize(): boolean {
    return this.normalize;
  }

  setK(k: number): void {
    if (k < 1) {
      throw new Error('K must be at least 1');
    }
    this.k = k;
  }

  setNumberOfClasses(numberOfClasses: number): void {
    this.numberOfClasses = numberOfClasses;
  }

  setNormalize(normalize: boolean): void {
    this.normalize = normalize;
  }
}
