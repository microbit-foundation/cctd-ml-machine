import type { PredictionOutput } from '../../core/classifier/PredictionOutput';
import { VectorPredictionInput } from '../../core/classifier/vector-classifier/VectorPredictionInput';
import { Confidences } from '../../core/entities/Confidences';
import type { GestureID } from '../../core/entities/NewGesture';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type { ClassifierService } from '../domain/ClassifierService';
import type { ConfidenceService } from '../domain/ConfidenceService';
import type { DataService } from '../domain/DataService';
import type { GestureRepository } from '../domain/GestureRepository';

export class PollingPredictorEngine {
  private log = new ConsoleLogger(PollingPredictorEngine.name);
  private pollingInterval: ReturnType<typeof setInterval> | undefined;
  private isRunning: boolean = false;

  constructor(
    private classifierService: ClassifierService,
    private dataService: DataService,
    private confidenceService: ConfidenceService,
    private gestureRepository: GestureRepository,
    private pollingPredictionInterval: number,
    private pollingPredictionSampleSize: number,
    private pollingPredictionSampleDuration: number,
  ) {}

  public stop() {
    this.log.info('Stopping PollingPredictorEngine');
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }
    this.isRunning = false;
  }

  public start() {
    if (!this.isRunning) {
      this.log.info(
        'Starting PollingPredictorEngine with interval',
        this.pollingPredictionInterval,
        'ms, sample size',
        this.pollingPredictionSampleSize,
        'and sample duration',
        this.pollingPredictionSampleDuration,
        'ms',
      );
      this.startPolling();
    }
  }

  private startPolling() {
    this.isRunning = true;
    this.pollingInterval = setInterval(() => this.poll(), this.pollingPredictionInterval);
  }

  private async poll(): Promise<void> {
    const prediction = await this.predict();
    if (prediction === undefined) {
      return;
    }
    const outputVectorValue = prediction.getPrediction().getValue();
    const gestures = this.gestureRepository.getGestures();
    const confidenceMap = new Map<GestureID, number>();
    for (let i = 0; i < gestures.length; i++) {
      confidenceMap.set(gestures[i].getID(), outputVectorValue[i]);
    }
    const confidences = new Confidences(confidenceMap);
    this.confidenceService.setConfidences(confidences);
  }

  private async predict(): Promise<PredictionOutput | undefined> {
    const classifier = this.classifierService.getClassifier();
    if (!this.isRunning || classifier === undefined) {
      return;
    }
    const liveDataSeries = this.dataService.getLiveData(
      this.pollingPredictionSampleDuration,
      this.pollingPredictionSampleSize,
    );
    if (liveDataSeries.length === 0) {
      return;
    }
    if (liveDataSeries.length < 8) {
      // The filters require at least 8 data points, so if there are too few, we cannot make a prediction
      return;
    }
    const selectedAxes = this.dataService.getSelectedAxes();
    const filters = this.dataService.getFilters();
    const predictionInput = VectorPredictionInput.getFilteredForAxes(
      filters,
      liveDataSeries,
      selectedAxes,
    );
    return await this.classifierService.predict(predictionInput);
  }
}
