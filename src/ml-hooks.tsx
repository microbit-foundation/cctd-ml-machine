import { useMemo } from "react";
import { useGestureData } from "./gestures-hooks";
import { useLogging } from "./logging/logging-hooks";
import { useMlStatus } from "./ml-status-hooks";
import { MlActions } from "./ml-actions";
import { useConnectionStage } from "./connection-stage-hooks";

export const useMlActions = () => {
  const [gestures, setGestures] = useGestureData();
  const [status, setStatus] = useMlStatus();
  const logger = useLogging();
  const { isConnected } = useConnectionStage();

  const actions = useMemo<MlActions>(
    () =>
      new MlActions(
        logger,
        isConnected,
        gestures,
        setGestures,
        status,
        setStatus
      ),
    [gestures, isConnected, logger, setGestures, setStatus, status]
  );
  return actions;
};
