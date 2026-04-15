import type { PredictionInput } from '../../core/classifier/Predictioninput';
import { VectorPredictionInput } from '../../core/classifier/vector-classifier/VectorPredictionInput';
import type { ClassifierService } from '../domain/ClassifierService';
import type { DataService } from '../domain/DataService';

export class PollingPredictorEngine {
  private pollingInterval: ReturnType<typeof setInterval> | undefined;
  private isRunning: boolean;

  constructor(
    private classifierService: ClassifierService,
    private dataService: DataService,
    private pollingPredictionInterval: number,
    private pollingPredictionSampleSize: number,
    private pollingPredictionSampleDuration: number,
  ) {
    this.isRunning = true;
    this.startPolling();
  }

  private startPolling() {
    this.pollingInterval = setInterval(() => {
      void this.predict();
    }, this.pollingPredictionInterval);
  }

  private predict() {
    const classifier = this.classifierService.getClassifier();
    const liveData = this.dataService.getLiveData(
      this.pollingPredictionSampleDuration,
      this.pollingPredictionSampleSize,
    );
    const selectedAxes = this.dataService.getSelectedAxes();
    const filters = this.dataService.getFilters();
    const predictionInput = VectorPredictionInput.getFilteredForAxes(
      filters,
      liveData,
      selectedAxes,
    );
    if (classifier === undefined) {
      return;
    }
    if (!this.isRunning) {
      return;
    }
    // SO FAR SO GOOD.

    const numberOfSamples = input.getNumberOfSamples();
    const requiredNumberOfSamples = Math.max(
      ...get(this.classifier.getFilters()).map(filter => filter.getMinNumberOfSamples()),
    );
    if (numberOfSamples < requiredNumberOfSamples) {
      return;
    }
    void this.classifier.classify(input);
  }

  private bufferToInput(): PredictionInput {
    const bufferedData = this.getRawDataFromBuffer(this.pollingPredictionSampleSize);
    return ClassifierInput.getInputForAxes(
      bufferedData.map(e => e.value),
      get(this.highlightedAxes),
    );
  }

  /**
   * Searches for an applicable amount of data, by iterately trying fewer data points if buffer fetch fails
   */
  private getRawDataFromBuffer(sampleSize: number): TimestampedData<LiveDataVector>[] {
    try {
      return this.liveData
        .getBuffer()
        .getSeries(getFeature<number>(Feature.RECORDING_DURATION), sampleSize);
    } catch (_e) {
      if (sampleSize < 8) {
        return []; // The minimum number of points is 8, otherwise the filters will throw an exception
      } else {
        // If too few samples are available, try again with fewer samples
        return this.getRawDataFromBuffer(
          sampleSize - StaticConfiguration.pollingPredictionSampleSizeSearchStepSize,
        );
      }
    }
  }
}
