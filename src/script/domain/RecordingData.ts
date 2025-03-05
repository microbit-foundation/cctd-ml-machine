export type RecordingData = {
  ID: number;
  samples: {
    vector: number[];
  }[];
  labels: string[];
};