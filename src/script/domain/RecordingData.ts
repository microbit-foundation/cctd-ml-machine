export interface RecordingSample {
  vector: number[];
}
export interface RecordingData {
  ID: number;
  samples: RecordingSample[];
  labels: string[];
}
