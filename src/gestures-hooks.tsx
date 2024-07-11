import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useStorage } from "./hooks/use-storage";
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

export enum TrainingStatus {
  NotStarted,
  InProgress,
  Complete,
}

interface GestureContextState {
  trainingStatus: TrainingStatus;
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
  trainingStatus: TrainingStatus.NotStarted,
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

export const useTrainingStatus = (): [
  TrainingStatus,
  (status: TrainingStatus) => void
] => {
  const [gestures, setGestures] = useGestureData();
  const trainingStatus = gestures.trainingStatus;
  const setTrainingStatus = useCallback(
    (status: TrainingStatus) => {
      setGestures({ ...gestures, trainingStatus: status });
    },
    [gestures, setGestures]
  );
  return [trainingStatus, setTrainingStatus];
};

export const useGestureActions = () => {
  const [gestures, setGestures] = useGestureData();
  const actions = useMemo<GestureActions>(
    () => new GestureActions(gestures, setGestures),
    [gestures, setGestures]
  );
  return actions;
};

export class GestureActions {
  constructor(
    private state: GestureContextState,
    private setState: (gestureData: GestureContextState) => void
  ) {}

  isSufficientForTraining = (): boolean => {
    const gestures = this.state.data;
    if (gestures.length < 2) {
      return false;
    }
    return !gestures.some((g) => g.recordings.length < 3);
  };

  addNewGesture = () => {
    this.setGestures([...this.state.data, generateNewGesture()]);
  };

  addGestureRecordings = (id: GestureData["ID"], recs: RecordingData[]) => {
    const newGestures = this.state.data.map((g) => {
      return id !== g.ID ? g : { ...g, recordings: [...recs, ...g.recordings] };
    });
    this.setGestures(newGestures);
  };

  setGestures = (gestures: GestureData[]) => {
    if (gestures.length === 0) {
      // Always have at least one gesture
      this.setState({ ...this.state, ...initialGestureContextState });
      return;
    }
    this.setState({ ...this.state, data: gestures });
  };

  deleteGesture = (id: GestureData["ID"]) => {
    this.setGestures(this.state.data.filter((g) => g.ID !== id));
  };

  setGestureName = (id: GestureData["ID"], name: string) => {
    const newGestures = this.state.data.map((g) => {
      return id !== g.ID ? g : { ...g, name };
    });
    this.setGestures(newGestures);
  };

  deleteGestureRecording = (
    gestureId: GestureData["ID"],
    recordingIdx: number
  ) => {
    const newGestures = this.state.data.map((g) => {
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
