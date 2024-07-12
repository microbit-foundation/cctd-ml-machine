import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export enum TrainingStatus {
  InsufficientData,
  NotTrained,
  InProgress,
  Complete,
  Retrain,
}

interface TrainingState {
  status: TrainingStatus;
  hasTrainedBefore: boolean;
}

type TrainingContextValue = [TrainingState, (state: TrainingState) => void];

const TrainingStatusContext = createContext<TrainingContextValue | undefined>(
  undefined
);

const initialTrainingState = {
  status: TrainingStatus.NotTrained,
  hasTrainedBefore: false,
};

export const TrainingStatusProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const trainingStatusContextValue =
    useState<TrainingState>(initialTrainingState);
  return (
    <TrainingStatusContext.Provider value={trainingStatusContextValue}>
      {children}
    </TrainingStatusContext.Provider>
  );
};

export const useTrainingStatus = (): [
  TrainingStatus,
  (status: TrainingStatus) => void
] => {
  const trainingStatusContextValue = useContext(TrainingStatusContext);
  if (!trainingStatusContextValue) {
    throw new Error("Missing provider");
  }
  const [state, setState] = trainingStatusContextValue;

  const setTrainingStatus = useCallback(
    (trainingStatus: TrainingStatus) => {
      const hasTrainedBefore =
        trainingStatus === TrainingStatus.Complete || state.hasTrainedBefore;

      // Update to retrain instead of not trained if has trained before
      const status =
        hasTrainedBefore && trainingStatus === TrainingStatus.NotTrained
          ? TrainingStatus.Retrain
          : trainingStatus;

      setState({ ...state, status, hasTrainedBefore });
    },
    [setState, state]
  );

  return [state.status, setTrainingStatus];
};
