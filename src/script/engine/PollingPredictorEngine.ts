import { Subscriber, Unsubscriber, Writable, derived, get, writable } from 'svelte/store';
import Classifier from '../domain/Classifier';
import Engine, { EngineData } from '../domain/Engine';
import LiveData from '../domain/LiveData';
import { liveData } from '../stores/Stores';
import AccelerometerClassifierInput, {
  AccelerometerRecording,
} from '../mlmodels/AccelerometerClassifierInput';
import { MicrobitAccelerometerData } from '../livedata/MicrobitAccelerometerData';

class PollingPredictorEngine implements Engine {
  private pollingInterval: ReturnType<typeof setInterval>;
  private pollingIntervalTime = 100;
  private isRunning: Writable<boolean>;
  private isReady: boolean;

  constructor(
    private classifier: Classifier,
    private liveData: LiveData<MicrobitAccelerometerData>,
  ) {
    this.isRunning = writable(true);
    this.isReady = true;
    this.pollingInterval = setInterval(() => {
      void this.predict();
    }, this.pollingIntervalTime);
  }
  public subscribe(
    run: Subscriber<EngineData>,
    invalidate?: ((value?: EngineData | undefined) => void) | undefined,
  ): Unsubscriber {
    return derived([this.isRunning], stores => {
      const isRunning = stores[0];
      return {
        isRunning: isRunning,
      };
    }).subscribe(run, invalidate);
  }

  public start(): void {
    this.isRunning.set(true);
  }

  public stop(): void {
    this.isRunning.set(false);
  }

  private predict() {
    if (this.classifier.getModel().isTrained() && get(this.isRunning)) {
      void this.classifier.classify(this.bufferToInput());
    }
  }

  private bufferToInput(): AccelerometerClassifierInput {
    const bufferedData = this.liveData.getBuffer().getSeries(1800, 80); // Todo: Replace these values with appropriate sources of truth
    const input: AccelerometerRecording = {
      x: bufferedData.map(data => data.value.accelX),
      y: bufferedData.map(data => data.value.accelY),
      z: bufferedData.map(data => data.value.accelZ),
    };
    return new AccelerometerClassifierInput(input);
  }
}

export default PollingPredictorEngine;
