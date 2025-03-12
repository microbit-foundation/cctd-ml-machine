export interface RecordingData {
  ID: number;
  samples: {
    vector: number[];
  }[];
  labels: string[];
}
