import type { RecordingData } from '../RecordingData';
import type { Recording } from './Recording';
import { Sample } from './Sample';

export class RecordingImpl implements Recording {
  constructor(private recordingData: RecordingData) {}

  getId(): number {
    return this.recordingData.ID;
  }
  getSamples(): Sample[] {
    return this.recordingData.samples.map(sample => {
      return new Sample(sample.vector);
    });
  }
}
