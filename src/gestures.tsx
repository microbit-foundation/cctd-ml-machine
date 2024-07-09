import { ReactNode, createContext, useContext } from "react";
import { dummyGestureData } from "./dummy-gesture-data";
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

type GestureContextValue = [
  GestureData[],
  (gestureData: GestureData[]) => void
];

const isValidGestureData = (value: unknown): value is GestureData[] => {
  if (typeof value !== "object" && !Array.isArray(value)) {
    return false;
  }
  const array = value as unknown[];
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

const GesturesProvider = ({ children }: { children: ReactNode }) => {
  const gestures = useStorage<GestureData[]>(
    "local",
    "gestures",
    dummyGestureData,
    isValidGestureData
  );
  return (
    <GestureContext.Provider value={gestures}>
      {children}
    </GestureContext.Provider>
  );
};

export default GesturesProvider;
