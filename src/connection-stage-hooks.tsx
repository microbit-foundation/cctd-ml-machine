import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { ConnectionStageActions } from "./connection-stage-actions";
import { useLogging } from "./logging/logging-hooks";
import { useConnections } from "./connections-hooks";
import { ConnectActions } from "./connect-actions";

export enum ConnectionFlowType {
  Bluetooth = "bluetooth",
  RadioBridge = "bridge",
  RadioRemote = "remote",
}

export interface ConnectionStage {
  step: ConnectionFlowStep;
  type: ConnectionFlowType;

  // TODO: Separate into different hook
  isWebUsbSupported: boolean;
  isWebBluetoothSupported: boolean;
}

export enum ConnectionFlowStep {
  // Happy flow stages
  None,
  Start,
  ConnectCable,
  WebUsbFlashingTutorial,
  ManualFlashingTutorial,
  ConnectBattery,
  EnterBluetoothPattern,
  ConnectBluetoothTutorial,

  // Stages that are not user-controlled
  WebUsbChooseMicrobit,
  ConnectingBluetooth,
  ConnectingMicrobits,
  FlashingInProgress,

  // Failure stages
  TryAgainReplugMicrobit,
  TryAgainCloseTabs,
  TryAgainSelectMicrobit,
  TryAgainBluetoothConnect,
  BadFirmware,
  MicrobitUnsupported,
  WebUsbBluetoothUnsupported,

  ReconnectAutoFail,
  ReconnectManualFail,
  ReconnectFailedTwice,
}

export enum ConnEvent {
  // User triggered events
  Start,
  Switch,
  Next,
  Back,
  SkipFlashing,
  TryAgain,
  GoToBluetoothStart,
  Close,

  // Web USB Flashing events
  WebUsbChooseMicrobit,
  FlashingInProgress,
  ConnectBattery,

  // Web USB Flashing failure events
  TryAgainReplugMicrobit,
  TryAgainCloseTabs,
  TryAgainSelectMicrobit,
  InstructManualFlashing,
  BadFirmware,
  MicrobitUnsupported,

  // Bluetooth connection event
  ConnectingBluetooth,

  // Connecting microbits for radio connection
  ConnectingMicrobits,

  // Connection failure event
  ConnectFailed,
  ReconnectAutoFail,
  ReconnectManualFail,
  ReconnectFailedTwice,
}

type ConnectionStageContextValue = [
  ConnectionStage,
  (state: ConnectionStage) => void
];

export const ConnectionStageContext =
  createContext<ConnectionStageContextValue | null>(null);

interface ConnectionStageProviderProps {
  children: ReactNode;
}

export const ConnectionStageProvider = ({
  children,
}: ConnectionStageProviderProps) => {
  // TODO: Check bt and usb compatibility
  const isWebBluetoothSupported = true;
  const isWebUsbSupported = true;

  const connectionStageContextValue = useState<ConnectionStage>({
    type: isWebBluetoothSupported
      ? ConnectionFlowType.Bluetooth
      : ConnectionFlowType.RadioRemote,
    step: ConnectionFlowStep.None,
    isWebUsbSupported,
    isWebBluetoothSupported,
  });
  return (
    <ConnectionStageContext.Provider value={connectionStageContextValue}>
      {children}
    </ConnectionStageContext.Provider>
  );
};

export const useConnectionStage = (): {
  stage: ConnectionStage;
  actions: ConnectionStageActions;
} => {
  const connectionStageContextValue = useContext(ConnectionStageContext);
  if (!connectionStageContextValue) {
    throw new Error("Missing provider");
  }
  const [stage, setStage] = connectionStageContextValue;
  const logging = useLogging();
  const { connections, state: connectionsState } = useConnections();

  const actions = useMemo(() => {
    const connectActions = new ConnectActions(logging, connections);

    return new ConnectionStageActions(
      connectActions,
      stage,
      setStage,
      connectionsState,
      connections
    );
  }, [logging, connections, stage, setStage, connectionsState]);

  return {
    stage,
    actions,
  };
};
