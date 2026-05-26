import type { Dataset } from '../../../core/dataset/Dataset';
import DatasetImpl from '../../../core/dataset/DatasetImpl';
import type { DatasetLabels } from '../../../core/dataset/DatasetLabels';
import { DatasetLabelsImpl } from '../../../core/dataset/DatasetLabelsImpl';
import type { FeatureData } from '../../../core/dataset/FeatureData';
import { FeatureDataImpl } from '../../../core/dataset/FeatureDataImpl';
import { LabelledFeatureSetImpl } from '../../../core/dataset/LabelledFeatureSetImpl';
import type { Axis } from '../../../core/entities/Axis';
import type { NewGesture } from '../../../core/entities/NewGesture';
import type { Recording } from '../../../core/entities/recording/Recording';
import type { Filter } from '../../../core/filter/Filter';
import BaseVector from '../../../core/vector/BaseVector';
import type { GestureService } from '../../domain/GestureService';

export class GestureDatasetFactory {
  constructor(private gestureService: GestureService) {}

    /** Builds dataset from filters and selected axes. Provide the getRecordings method to determine how to fetch recordings. Can be used for validation- or regular recordings */
  public buildDataset(
    getRecordings: (gesture: NewGesture) => Recording[],
    selectedAxes: Axis[],
    filters: Filter[],
  ): Dataset {
    const gestures = this.gestureService.getGestures();

    const labelVectors: BaseVector[] = gestures.flatMap((gesture, idx) => {
      const recordings = getRecordings(gesture);
      const vector = Array(gestures.length).fill(0);
      vector[idx] = 1;
      return recordings.map(() => new BaseVector(vector));
    });
    const datasetLabels: DatasetLabels = new DatasetLabelsImpl(labelVectors);

    const featureData: FeatureData[] = gestures.flatMap(gesture => {
      const recordings = getRecordings(gesture);
      return recordings.map(recording =>
        this.createFeatureDataFromRecording(recording, filters, selectedAxes),
      );
    });

    if (featureData.length === 0) {
      return new DatasetImpl(new LabelledFeatureSetImpl([], datasetLabels), 0, new BaseVector([]), new BaseVector([]));
    }

    const featureSum = new BaseVector(Array(filters.length * selectedAxes.length).fill(0));
    featureData.forEach(fd => {
      const features = fd.getFeatures();
      featureSum.add(features);
    });
    const featureMean = featureSum.divideByScalar(featureData.length);
    const featureStdDeviation = new BaseVector(Array(filters.length * selectedAxes.length).fill(0));
    featureData.forEach(fd => {
      const features = fd.getFeatures();
      const diff = features.subtract(featureMean);
      const squaredDiff = new BaseVector(diff.getValue().map(val => val * val));
      featureStdDeviation.add(squaredDiff);
    });
    featureStdDeviation.divideByScalar(featureData.length);
    const featureSize = featureData[0].getFeatures().getSize();

    const labelledFeatureSet = new LabelledFeatureSetImpl(featureData, datasetLabels);

    return new DatasetImpl(
      labelledFeatureSet,
      featureSize,
      featureMean,
      featureStdDeviation,
    );
  }
  
  private createFeatureDataFromRecording(
    recording: Recording,
    filters: Filter[],
    axes: Axis[],
  ): FeatureData {
    const samples = recording.getSamples();
    const samplesByAxis = axes.map(axis =>
      samples.map(sample => sample.getValue()[axis.index]),
    );
    const features: number[] = [];
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      for (let j = 0; j < samplesByAxis.length; j++) {
        const axisSamples = samplesByAxis[j];
        const filteredValue = filter.filter(axisSamples);
        features.push(filteredValue);
      }
    }

    return new FeatureDataImpl(new BaseVector(features));
  }
}
