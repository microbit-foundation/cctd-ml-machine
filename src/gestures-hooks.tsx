import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { useStorage } from "./hooks/use-storage";
import { Stage, Status, useStatus } from "./status-hook";
export interface XYZData {
  x: number[];
  y: number[];
  z: number[];
}

interface RecordingData {
  ID: number;
  data: XYZData;
}

interface StoredGestureData {
  name: string;
  ID: number;
  recordings: RecordingData[];
}
export interface GestureData extends StoredGestureData {
  // Confidence is added after a successful training and predicting of data
  confidence?: {
    currentConfidence?: number; // from 0-1
    requiredConfidence: number; // from 0-1
  };
}

// Used for getPredicted in MlActions hook
export interface ConfidentGestureData extends StoredGestureData {
  confidence: {
    currentConfidence: number; // from 0-1
    requiredConfidence: number; // from 0-1
  };
}

interface StoredGestureContextState {
  data: StoredGestureData[];
}

export interface GestureContextState {
  data: GestureData[];
}

type GestureContextValue = [
  GestureContextState,
  (gestureData: GestureContextState) => void
];

const isValidStoredGestureData = (v: unknown): v is GestureContextState => {
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
  // Only name, ID, and recordings of gesture data are stored in local storage
  // so two separate states (one stored and the other not) are used to store
  // gesture data and are kept in sync by this provider.
  const [storedState, setStoredState] = useStorage<StoredGestureContextState>(
    "local",
    "gestures",
    initialGestureContextState,
    isValidStoredGestureData
  );
  const [state, setState] = useState<GestureContextState>({
    data: storedState.data as GestureData[],
  });
  const setStates = (newState: GestureContextState) => {
    setStoredState({
      ...newState,
      data: newState.data.map(({ name, recordings, ID }) => ({
        name,
        recordings,
        ID,
      })),
    });
    setState(newState);
  };
  return (
    <GestureContext.Provider value={[state, setStates]}>
      {children}
    </GestureContext.Provider>
  );
};

export const useGestureActions = () => {
  const [gestures, setGestures] = useGestureData();
  const [status, setStatus] = useStatus();
  const actions = useMemo<GestureActions>(
    () => new GestureActions(gestures, setGestures, status, setStatus),
    [gestures, setGestures, setStatus, status]
  );
  return actions;
};

class GestureActions {
  constructor(
    private gestureState: GestureContextState,
    private setGestureState: (gestureData: GestureContextState) => void,
    private status: Status,
    private setStatus: (status: Status) => void
  ) {}

  hasGestures = () => {
    return (
      this.gestureState.data.length > 0 &&
      (this.gestureState.data[0].name.length > 0 ||
        this.gestureState.data[0].recordings.length > 0)
    );
  };

  setGestures = (gestures: GestureData[], isRetrainNeeded: boolean = true) => {
    const data =
      // Always have at least one gesture
      gestures.length === 0 ? initialGestureContextState.data : gestures;
    this.setGestureState({ ...this.gestureState, data });

    const newTrainingStatus = updateStatus(data, this.status, isRetrainNeeded);
    this.setStatus(newTrainingStatus);
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

const updateStatus = (
  data: GestureData[],
  currStatus: Status,
  isTrainingNeeded: boolean
): Status => {
  if (!hasSufficientDataForTraining(data)) {
    return { stage: Stage.InsufficientData };
  }
  if (isTrainingNeeded || currStatus.stage === Stage.InsufficientData) {
    // Logic for updating status to retrain is in the training status hook
    return { stage: Stage.NotTrained };
  }
  return currStatus;
};
