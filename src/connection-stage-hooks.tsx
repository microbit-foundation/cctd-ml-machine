import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { ConnectionStageActions } from "./connection-stage-actions";
import { useLogging } from "./logging/logging-hooks";
import { ConnectActions } from "./connect-actions";

export enum ConnectionFlowType {
  Bluetooth = "bluetooth",
  RadioBridge = "bridge",
  RadioRemote = "remote",
}

export enum ConnectionStatus {
  None, // Have not been connected before
  Connecting,
  Connected,
  Disconnected,
  Reconnecting,
}

export type ConnectionType = "bluetooth" | "radio";

export interface ConnectionStage {
  // For connection flow
  flowStep: ConnectionFlowStep;
  flowType: ConnectionFlowType;
  // Number of times there have been consecutive reconnect fails
  // for determining which reconnection dialog to show
  reconnectFailStreak: number;

  // Connection details
  deviceIds: number[];
  status: ConnectionStatus;
  connType: ConnectionType;

  // Compatibility
  isWebBluetoothSupported: boolean;
  isWebUsbSupported: boolean;
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

const initialConnectionStageValue: ConnectionStage = {
  flowStep: ConnectionFlowStep.None,
  flowType: ConnectionFlowType.Bluetooth,
  reconnectFailStreak: 0,
  deviceIds: [],
  status: ConnectionStatus.Disconnected,
  connType: "bluetooth",
  isWebBluetoothSupported: true,
  isWebUsbSupported: true,
};

export const ConnectionStageProvider = ({
  children,
}: ConnectionStageProviderProps) => {
  const connectionStageContextValue = useState<ConnectionStage>(
    initialConnectionStageValue
  );
  return (
    <ConnectionStageContext.Provider value={connectionStageContextValue}>
      {children}
    </ConnectionStageContext.Provider>
  );
};

export const useConnectionStage = (): {
  stage: ConnectionStage;
  actions: ConnectionStageActions;
  isConnected: boolean;
} => {
  const connectionStageContextValue = useContext(ConnectionStageContext);
  if (!connectionStageContextValue) {
    throw new Error("Missing provider");
  }
  const [stage, setStage] = connectionStageContextValue;
  const logging = useLogging();

  const actions = useMemo(() => {
    const connectActions = new ConnectActions(logging);
    return new ConnectionStageActions(connectActions, stage, setStage);
  }, [logging, stage, setStage]);

  const isConnected = useMemo(
    () => stage.status === ConnectionStatus.Connected,
    [stage.status]
  );

  return {
    stage,
    actions,
    isConnected,
  };
};
