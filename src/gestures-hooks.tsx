import { ReactNode, createContext, useContext, useMemo } from "react";
import { useStorage } from "./hooks/use-storage";
import { TrainingStatus, useTrainingStatus } from "./training-status-hook";
export interface XYZData {
  x: number[];
  y: number[];
  z: number[];
}

interface RecordingData {
  ID: number;
  data: XYZData;
}

export interface GestureData {
  name: string;
  ID: number;
  recordings: RecordingData[];
}

interface GestureContextState {
  data: GestureData[];
}

type GestureContextValue = [
  GestureContextState,
  (gestureData: GestureContextState) => void
];

const isValidGestureData = (v: unknown): v is GestureContextState => {
  if (typeof v !== "object") {
    return false;
  }
  const valueObject = v as object;
  if (!("data" in valueObject)) {
    return false;
  }
  const data = valueObject.data;
  if (typeof data !== "object" && !Array.isArray(data)) {
    return false;
  }
  const array = data as unknown[];
  for (const item of array) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    if (!("name" in item) || !("ID" in item) || !("recordings" in item)) {
      return false;
    }
    if (typeof item.recordings !== "object") {
      return false;
    }
    // TODO: Validate recordings
  }
  return true;
};

const GestureContext = createContext<GestureContextValue | undefined>(
  undefined
);

export const useGestureData = (): GestureContextValue => {
  const gestureData = useContext(GestureContext);
  if (!gestureData) {
    throw new Error("Missing provider");
  }
  return gestureData;
};

const generateNewGesture = (): GestureData => ({
  name: "",
  recordings: [],
  ID: Date.now(),
});

const initialGestureContextState: GestureContextState = {
  data: [generateNewGesture()],
};

export const GesturesProvider = ({ children }: { children: ReactNode }) => {
  const gestures = useStorage<GestureContextState>(
    "local",
    "gestures",
    initialGestureContextState,
    isValidGestureData
  );
  return (
    <GestureContext.Provider value={gestures}>
      {children}
    </GestureContext.Provider>
  );
};

export const useGestureActions = () => {
  const [gestures, setGestures] = useGestureData();
  const [trainingStatus, setTrainingStatus] = useTrainingStatus();
  const actions = useMemo<GestureActions>(
    () =>
      new GestureActions(
        gestures,
        setGestures,
        trainingStatus,
        setTrainingStatus
      ),
    [gestures, setGestures, setTrainingStatus, trainingStatus]
  );
  return actions;
};

export class GestureActions {
  constructor(
    private gestureState: GestureContextState,
    private setGestureState: (gestureData: GestureContextState) => void,
    private trainingStatus: TrainingStatus,
    private setTrainingStatus: (status: TrainingStatus) => void
  ) {}

  setGestures = (gestures: GestureData[], isRetrainNeeded: boolean = true) => {
    const data =
      // Always have at least one gesture
      gestures.length === 0 ? initialGestureContextState.data : gestures;
    this.setGestureState({ ...this.gestureState, data });

    const newTrainingStatus = updateTrainingStatus(
      data,
      this.trainingStatus,
      isRetrainNeeded
    );
    this.setTrainingStatus(newTrainingStatus);
  };

  addNewGesture = () => {
    this.setGestures([...this.gestureState.data, generateNewGesture()]);
  };

  addGestureRecordings = (id: GestureData["ID"], recs: RecordingData[]) => {
    const newGestures = this.gestureState.data.map((g) => {
      return id !== g.ID ? g : { ...g, recordings: [...recs, ...g.recordings] };
    });
    this.setGestures(newGestures);
  };

  deleteGesture = (id: GestureData["ID"]) => {
    this.setGestures(this.gestureState.data.filter((g) => g.ID !== id));
  };

  setGestureName = (id: GestureData["ID"], name: string) => {
    const newGestures = this.gestureState.data.map((g) => {
      return id !== g.ID ? g : { ...g, name };
    });
    this.setGestures(newGestures, false);
  };

  deleteGestureRecording = (
    gestureId: GestureData["ID"],
    recordingIdx: number
  ) => {
    const newGestures = this.gestureState.data.map((g) => {
      if (gestureId !== g.ID) {
        return g;
      }
      const recordings = g.recordings.filter((_r, i) => i !== recordingIdx);
      return { ...g, recordings };
    });
    this.setGestures(newGestures);
  };

  deleteAllGestures = () => {
    this.setGestures([]);
  };
}

const hasSufficientDataForTraining = (gestures: GestureData[]): boolean => {
  return (
    gestures.length >= 2 && gestures.every((g) => g.recordings.length >= 3)
  );
};

const updateTrainingStatus = (
  data: GestureData[],
  currTrainingStatus: TrainingStatus,
  isTrainingNeeded: boolean
) => {
  if (!hasSufficientDataForTraining(data)) {
    return TrainingStatus.InsufficientData;
  }
  if (
    isTrainingNeeded ||
    currTrainingStatus === TrainingStatus.InsufficientData
  ) {
    // Logic for updating status to retrain is in the training status hook
    return TrainingStatus.NotTrained;
  }
  return currTrainingStatus;
};
