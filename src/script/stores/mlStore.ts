import { persistantWritable } from "./storeUtil";
import { get, writable } from "svelte/store";
import { t } from "../../i18n";
import { ML5NeuralNetwork } from "ml5";

let text: (key: string, vars?: object) => string = get(t);
t.subscribe(t => text = t);

export type RecordingData = {
	ID: number,
	data: {
		x: number[],
		y: number[],
		z: number[]
	}
}

export type GestureData = {
	name: string,
	ID: number,
	recordings: RecordingData[],
	output: GestureOutput,
	confidence?: number
}

export type GestureOutput = {
	matrix?: boolean[]
	sound?: SoundData
}

export type SoundData = {
	name: string,
	id: string,
	path: string
}

export type LiveData = {
	accelX: number
	accelY: number
	accelZ: number
	smoothedAccelX: number
	smoothedAccelY: number
	smoothedAccelZ: number
}

export enum TrainingStatus {
	Untrained,
	Success,
	Failure
}


export type MlSettings = {
	duration: number, // Duration of recording
	numEpochs: number, // Number of epochs for ML
	numSamples: number, // number of samples in one recording (when recording samples)
	minSamples: number, // minimum number of samples for reliable detection (when detecting gestures)
	updatesPrSecond: number, // Times algorithm predicts data pr second
	learningRate: number,
	includedAxes: boolean[],
	includedParameters: boolean[],
	preferableButton: "A" | "B" | "AB",
	automaticClassification: boolean,
	output: boolean
}

const initialSettings: MlSettings = {
	duration: 1800,
	numEpochs: 80,
	numSamples: 60,
	minSamples: 50,
	updatesPrSecond: 4,
	learningRate: 0.5,
	includedAxes: [true, true, true],
	includedParameters: [true, true, true, true, true],
	preferableButton: "AB",
	automaticClassification: true,
	output: true
};

export const gestures = persistantWritable<GestureData[]>("gestureData", []);

export const livedata = writable<LiveData>({} as LiveData);

// Store with ML-Algorithm settings
export const settings = writable<MlSettings>(initialSettings);

// Store for current gestures

export const chosenGesture = writable<GestureData | null>(null);

export function addGesture(name: string): void {
	gestures.update((gestures) => {
		return [
			...gestures,
			{
				name,
				ID: Date.now(),
				recordings: [],
				output: {}
			}
		];
	});
}

export function removeGesture(gesture: GestureData) {
	gestures.update((gestures) => {
		const index = gestures.indexOf(gesture);
		if (index > -1) {
			gestures.splice(index, 1);
		}
		return gestures;
	});
}

export function addRecording(gestureID: number, recording: RecordingData) {
	gestures.update((gestures) => {
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
	gestures.update((gestures) => {
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

export function updateGestureSoundOutput(gestureID: number, sound: SoundData | undefined) {
	gestures.update((gestures) => {
		for (const gesture of gestures) {
			if (gesture.ID === gestureID) {
				gesture.output.sound = sound;
				break
			}
		}
		return gestures;
	});
}

export function updateGestureLEDOutput(gestureID: number, matrix: boolean[]) {
	gestures.update((gestures) => {
		for (const gesture of gestures) {
			if (gesture.ID === gestureID) {
				gesture.output.matrix = matrix;
				break
			}
		}
		return gestures;
	});
}


export const gestureConfidences = writable<{ [id: string]: number }>({});

// TODO: This is only used one place. Remove store and compute best prediction at said component? 
export const bestPrediction = writable<GestureData | undefined>(undefined);

// Store for components to assess model status
export const model = writable<ML5NeuralNetwork>(undefined);

export const trainingStatus = writable<TrainingStatus>(TrainingStatus.Untrained);

// Stores and manages previous data-elements. Used for classifying current gesture
// TODO: Only used for 'getPrevData' (which is only used for ml.ts). Do we even want this as global state?
export const prevData = writable<LiveData[]>(new Array(get(settings).numSamples));

let liveDataIndex = 0;
livedata.subscribe(data => {
	prevData.update((prevDataArray: LiveData[]) => {
		prevDataArray[liveDataIndex] = data;
		return prevDataArray;
	});
	liveDataIndex++;
	if (liveDataIndex >= get(settings).numSamples) {
		liveDataIndex = 0;
	}
});

// Store for training state. Used to radiate current epoch state (not done presently).
// TODO: Not used for anything presently (only ever updated). Use or delete 
export const trainingState = writable({
	percentage: 0,
	loss: 0,
	epochs: 0
});

// TODO: Only used at one location (ml.ts). Move to ml.ts?
export function getPrevData(): { x: number[], y: number[], z: number[] } {
	const data: LiveData[] = get(prevData);
	const dataLength: number = data.length;
	const x: number[] = new Array<number>(dataLength);
	const y: number[] = new Array<number>(dataLength);
	const z: number[] = new Array<number>(dataLength);

	for (let i = 0; i < dataLength; i++) {
		const oldDataIndex = (i + liveDataIndex) % dataLength;
		x[i] = (data[oldDataIndex].accelX);
		y[i] = (data[oldDataIndex].accelY);
		z[i] = (data[oldDataIndex].accelZ);
	}

	return { x, y, z };
}

// // Never used?
// export const lossGraphStore = writable(undefined);
// // Never used?
// export const classificationStore = writable({ lastRecording: undefined, recordingTime: undefined });