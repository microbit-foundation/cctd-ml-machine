import { LayersModel } from "@tensorflow/tfjs";
import { useMemo } from "react";
import {
  ConfidentGestureData,
  GestureContextState,
  GestureData,
  useGestureData,
} from "./gestures-hooks";
import { Logging } from "./logging/logging";
import { useLogging } from "./logging/logging-hooks";
import {
  Confidences,
  TrainModelInput,
  mlSettings,
  predict,
  trainModel,
} from "./ml";
import gestureData from "./test-fixtures/gesture-data.json";
import { TrainingStatus, useTrainingStatus } from "./training-status-hook";

const defaultRequiredConfidence = 0.8;

export const useMlActions = () => {
  const [gestures, setGestures] = useGestureData();
  const [trainingStatus, setTrainingStatus] = useTrainingStatus();
  const logger = useLogging();

  const actions = useMemo<MlActions>(
    () =>
      new MlActions(
        logger,
        gestures,
        setGestures,
        trainingStatus,
        setTrainingStatus
      ),
    [gestures, logger, setGestures, setTrainingStatus, trainingStatus]
  );
  return actions;
};

class MlActions {
  private predictionInterval: NodeJS.Timeout | undefined;
  private model: LayersModel | undefined;
  constructor(
    private logger: Logging,
    private gestureState: GestureContextState,
    private setGestureState: (gestureData: GestureContextState) => void,
    private trainingStatus: TrainingStatus,
    private setTrainingStatus: (status: TrainingStatus) => void
  ) {}

  trainModel = async (onTraining: TrainModelInput["onTraining"]) => {
    this.setTrainingStatus(TrainingStatus.InProgress);
    const { data } = this.gestureState;
    const model = await trainModel({
      data,
      onTraining,
      onTrainEnd: () => this.setTrainingStatus(TrainingStatus.Complete),
      onError: () => this.setTrainingStatus(TrainingStatus.Error),
    });

    if (!model) {
      // Errors in training a model are handled in train model function
      return;
    }

    this.model = model;
    this.logger.event({
      type: "Data",
      message: "Train model",
      detail: {
        numActions: data.length,
        numRecordings: data.reduce((acc, d) => d.recordings.length + acc, 0),
      },
    });
    this.predictionInterval = setInterval(
      this.testModel,
      1000 / mlSettings.updatesPrSecond
    );
  };

  private testModel = async () => {
    if (this.checkIfInterrupted() && this.predictionInterval) {
      clearInterval(this.predictionInterval);
    }

    // TODO: Hook for input connection
    const inputIsConnected = true;
    if (inputIsConnected) {
      const confidences = await predict({
        model: this.model as LayersModel,
        // TODO: Get data from accelerometer instead of using dummy data
        data: gestureData[1].recordings[0].data,
        classificationIds: this.gestureState.data.map((d) => d.ID),
      });
      if (!confidences) {
        // Error is handled in predict function
        return;
      }
      this.updateGestureDataConfidences(confidences);
    }
  };

  private checkIfInterrupted = () =>
    // TODO: Add state check for whether user is recording data
    this.trainingStatus !== TrainingStatus.Complete;

  private updateGestureDataConfidences = (confidences: Confidences) => {
    const updatedGestureData = this.gestureState.data.map(
      (gesture): GestureData => {
        return {
          ...gesture,
          confidence: {
            requiredConfidence:
              gesture.confidence?.requiredConfidence ??
              defaultRequiredConfidence,
            currentConfidence: confidences[gesture.ID] ?? undefined,
          },
        };
      }
    );
    this.setGestureState({ data: updatedGestureData });
  };

  getPredicted = () => {
    const confidentGestures = this.gestureState.data.filter((g) => {
      return (
        g.confidence !== undefined &&
        g.confidence.currentConfidence !== undefined &&
        g.confidence.currentConfidence > g.confidence.requiredConfidence
      );
    }) as ConfidentGestureData[];
    if (confidentGestures.length === 0) {
      return undefined;
    }
    return confidentGestures.reduce((prevPredictedGesture, gesture) => {
      return prevPredictedGesture.confidence.currentConfidence <
        gesture.confidence.currentConfidence
        ? gesture
        : prevPredictedGesture;
    });
  };

  updateGestureRequiredConfidence = (
    gestureId: GestureData["ID"],
    requiredConfidence: number
  ) => {
    this.setGestureState({
      ...this.setGestureState,
      data: this.gestureState.data.map((gesture) => {
        return gesture.ID === gestureId
          ? {
              ...gesture,
              confidence: {
                ...(gesture.confidence || {}),
                requiredConfidence,
              },
            }
          : gesture;
      }),
    });
  };
}
