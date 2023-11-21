import { Readable, Subscriber, Unsubscriber, Writable, derived, get } from 'svelte/store';
import Model, { ModelData } from './Model';
import AccelerometerClassifierInput from '../mlmodels/AccelerometerClassifierInput';
import Filters from './Filters';
import MLModel from './MLModel';

type ClassifierData = {
  model: ModelData;
};

export class Classifier implements Readable<ClassifierData> {
  constructor(
    private model: Readable<Model>,
    private filters: Writable<Filters>,
    private mlModel: Readable<MLModel>,
  ) {}
  public subscribe(
    run: Subscriber<ClassifierData>,
    invalidate?: ((value?: ClassifierData | undefined) => void) | undefined,
  ): Unsubscriber {
    return derived([this.model], stores => {
      const modelStore = stores[0];
      return {
        model: get(modelStore),
      };
    }).subscribe(run, invalidate);
  }

  public classify(input: AccelerometerClassifierInput) {
    this.getModel().predict(input.getInput(get(this.filters)));
  }

  public getModel(): Model {
    return get(this.model);
  }
}

export default Classifier;
