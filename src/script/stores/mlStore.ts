import { persistantWritable } from './storeUtil';
import { get, writable } from 'svelte/store';
import { LayersModel } from '@tensorflow/tfjs-layers';
import { state } from './uiStore';
import { Filters, Axes } from '../datafunctions';

export type RecordingData = {
  ID: number;
  data: {
    x: number[];
    y: number[];
    z: number[];
  };
};

export function loadDatasetFromFile(file: File) {
  const reader = new FileReader();
  reader.onload = function (e: ProgressEvent<FileReader>) {
    if (!e.target) {
      return;
    }
    const contents = e.target.result;
    if (typeof contents === 'string') {
      const gestureData: GestureData[] = JSON.parse(contents) as GestureData[];
      gestures.set(gestureData);
    }
  };
  reader.readAsText(file as Blob);
}

export function downloadDataset() {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(get(gestures), null, 2)),
  );
  element.setAttribute('download', 'dataset');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

export function clearGestures() {
  gestures.set([]);
}

export type GestureData = {
  name: string;
  ID: number;
  recordings: RecordingData[];
  output: GestureOutput;
  confidence?: number;
};

export type GestureOutput = {
  matrix?: boolean[];
  sound?: SoundData;
};

export type SoundData = {
  name: string;
  id: string;
  path: string;
};

export type LiveData = {
  accelX: number;
  accelY: number;
  accelZ: number;
  smoothedAccelX: number;
  smoothedAccelY: number;
  smoothedAccelZ: number;
};

export enum TrainingStatus {
  Untrained,
  Success,
  Failure,
}

type MlSettings = {
  duration: number; // Duration of recording
  numSamples: number; // number of samples in one recording (when recording samples)
  minSamples: number; // minimum number of samples for reliable detection (when detecting gestures)
  automaticClassification: boolean; // If true, automatically classify gestures
  updatesPrSecond: number; // Times algorithm predicts data pr second
  numEpochs: number; // Number of epochs for ML
  learningRate: number;
  includedAxes: Axes[];
  includedFilters: Filters[];
};

const initialSettings: MlSettings = {
  duration: 1800,
  numSamples: 80,
  minSamples: 80,
  automaticClassification: true,
  updatesPrSecond: 4,
  numEpochs: 80,
  learningRate: 0.5,
  includedAxes: [Axes.X, Axes.Y, Axes.Z],
  includedFilters: [Filters.MAX, Filters.MEAN, Filters.MIN, Filters.STD, Filters.PEAKS, Filters.ACC, Filters.ZCR, Filters.RMS],
};

export const gestures = persistantWritable<GestureData[]>('gestureData', []);

export const livedata = writable<LiveData>({} as LiveData);

// Store with ML-Algorithm settings
export const settings = writable<MlSettings>(initialSettings);

// Store for current gestures

export const chosenGesture = writable<GestureData | null>(null);

function updateToUntrainedState() {
  state.update(s => {
    s.isPredicting = false;
    return s;
  });
  trainingStatus.set(TrainingStatus.Untrained);
}

export function addGesture(name: string): void {
  updateToUntrainedState();
  gestures.update(gestures => {
    return [
      ...gestures,
      {
        name,
        ID: Date.now(),
        recordings: [],
        output: {},
      },
    ];
  });
}

export function removeGesture(gesture: GestureData) {
  updateToUntrainedState();
  gestures.update(gestures => {
    const index = gestures.indexOf(gesture);
    if (index > -1) {
      gestures.splice(index, 1);
    }
    return gestures;
  });
}

export function addRecording(gestureID: number, recording: RecordingData) {
  updateToUntrainedState();

  gestures.update(gestures => {
    for (const gesture of gestures) {
      if (gesture.ID === gestureID) {
        gesture.recordings = [...gesture.recordings, recording];
        break;
      }
    }
    return gestures;
  });
}

// Following function are inefficient. Consider other data structure for
// "gestures"
export function removeRecording(gestureID: number, recordingID: number) {
  updateToUntrainedState();
  gestures.update(gestures => {
    for (const gesture of gestures) {
      if (gesture.ID === gestureID) {
        for (let i = 0; i < gesture.recordings.length; i++) {
          if (gesture.recordings[i].ID === recordingID) {
            gesture.recordings.splice(i, 1);
            return gestures;
          }
        }
      }
    }
    return gestures;
  });
}

export function updateGestureSoundOutput(
  gestureID: number,
  sound: SoundData | undefined,
) {
  gestures.update(gestures => {
    for (const gesture of gestures) {
      if (gesture.ID === gestureID) {
        gesture.output.sound = sound;
        break;
      }
    }
    return gestures;
  });
}

export function updateGestureLEDOutput(gestureID: number, matrix: boolean[]) {
  gestures.update(gestures => {
    for (const gesture of gestures) {
      if (gesture.ID === gestureID) {
        gesture.output.matrix = matrix;
        break;
      }
    }
    return gestures;
  });
}

export const gestureConfidences = writable<{ [id: string]: number }>({});

// TODO: This is only used one place. Remove store and compute best prediction at said component?
export const bestPrediction = writable<GestureData | undefined>(undefined);

// Store for components to assess model status
export const model = writable<LayersModel>(undefined);

export const trainingStatus = writable<TrainingStatus>(TrainingStatus.Untrained);

// Stores and manages previous data-elements. Used for classifying current gesture
// TODO: Only used for 'getPrevData' (which is only used for ml.ts). Do we even want this as global state?
export const prevData = writable<LiveData[]>(new Array(get(settings).minSamples));

let liveDataIndex = 0;
livedata.subscribe(data => {
  prevData.update((prevDataArray: LiveData[]) => {
    prevDataArray[liveDataIndex] = data;
    return prevDataArray;
  });
  liveDataIndex++;
  if (liveDataIndex >= get(settings).minSamples) {
    liveDataIndex = 0;
  }
});

// Store for training state. Used to radiate current epoch state (not done presently).
// TODO: Not used for anything presently (only ever updated). Use or delete
export const trainingState = writable({
  percentage: 0,
  loss: 0,
  epochs: 0,
});

// TODO: Only used at one location (ml.ts). Move to ml.ts?
export function getPrevData(): { x: number[]; y: number[]; z: number[] } {
  const data: LiveData[] = get(prevData);
  const dataLength: number = data.length;
  const x: number[] = new Array<number>(dataLength);
  const y: number[] = new Array<number>(dataLength);
  const z: number[] = new Array<number>(dataLength);

  for (let i = 0; i < dataLength; i++) {
    const oldDataIndex = (i + liveDataIndex) % dataLength;
    x[i] = data[oldDataIndex].accelX;
    y[i] = data[oldDataIndex].accelY;
    z[i] = data[oldDataIndex].accelZ;
  }

  return { x, y, z };
}

// // Never used?
// export const lossGraphStore = writable(undefined);
// // Never used?
// export const classificationStore = writable({ lastRecording: undefined, recordingTime: undefined });
