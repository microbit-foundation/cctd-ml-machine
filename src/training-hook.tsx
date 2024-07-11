import { ReactNode, createContext, useContext, useState } from "react";

export enum TrainingStatus {
  InsufficientData,
  NotStarted,
  InProgress,
  Complete,
  Retrain,
}

type TrainingContextValue = [TrainingStatus, (status: TrainingStatus) => void];

const TrainingStatusContext = createContext<TrainingContextValue | undefined>(
  undefined
);

export const TrainingStatusProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const trainingStatusContextValue = useState<TrainingStatus>(
    TrainingStatus.NotStarted
  );
  return (
    <TrainingStatusContext.Provider value={trainingStatusContextValue}>
      {children}
    </TrainingStatusContext.Provider>
  );
};

export const useTrainingStatus = (): TrainingContextValue => {
  const trainingStatusContextValue = useContext(TrainingStatusContext);
  if (!trainingStatusContextValue) {
    throw new Error("Missing provider");
  }
  return trainingStatusContextValue;
};
