import { ReactNode, createContext, useContext, useMemo } from "react";
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

const initialGestureContextState: GestureContextState = { data: [] };

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

  setGestures = (gesture: GestureData[]) => {
    this.setState({ ...this.state, data: gesture });
  };

  deleteGesture = (id: GestureData["ID"]) => {
    this.setGestures(this.state.data.filter((g) => g.ID !== id));
  };
}
