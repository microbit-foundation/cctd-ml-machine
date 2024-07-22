import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ConnectionStageActions } from "./connection-stage-actions";
import { useLogging } from "./logging/logging-hooks";
import { ConnectActions } from "./connect-actions";
import { useNavigate } from "react-router";
import { useStorage } from "./hooks/use-storage";

export enum ConnectionFlowType {
  Bluetooth = "bluetooth",
  RadioBridge = "bridge",
  RadioRemote = "remote",
}

export enum ConnectionStatus {
  None = "None", // Have not been connected before
  Connecting = "Connecting",
  Connected = "Connected",
  Disconnected = "Disconnected",
  Reconnecting = "Reconnecting",
}

export type ConnectionType = "bluetooth" | "radio";

export enum ConnectionFlowStep {
  // Happy flow stages
  None = "None",
  Start = "Start",
  ConnectCable = "ConnectCable",
  WebUsbFlashingTutorial = "WebUsbFlashingTutorial",
  ManualFlashingTutorial = "ManualFlashingTutorial",
  ConnectBattery = "ConnectBattery",
  EnterBluetoothPattern = "EnterBluetoothPattern",
  ConnectBluetoothTutorial = "ConnectBluetoothTutorial",

  // Stages that are not user-controlled
  WebUsbChooseMicrobit = "WebUsbChooseMicrobit",
  ConnectingBluetooth = "ConnectingBluetooth",
  ConnectingMicrobits = "ConnectingMicrobits",
  FlashingInProgress = "FlashingInProgress",

  // Failure stages
  TryAgainReplugMicrobit = "TryAgainReplugMicrobit",
  TryAgainCloseTabs = "TryAgainCloseTabs",
  TryAgainSelectMicrobit = "TryAgainSelectMicrobit",
  TryAgainBluetoothConnect = "TryAgainBluetoothConnect",
  BadFirmware = "BadFirmware",
  MicrobitUnsupported = "MicrobitUnsupported",
  WebUsbBluetoothUnsupported = "WebUsbBluetoothUnsupported",

  ReconnectAutoFail = "ReconnectAutoFail",
  ReconnectManualFail = "ReconnectManualFail",
  ReconnectFailedTwice = "ReconnectFailedTwice",
}

export enum ConnEvent {
  // User triggered events
  Start = "Start",
  Switch = "Switch",
  Next = "Next",
  Back = "Back",
  SkipFlashing = "SkipFlashing",
  TryAgain = "TryAgain",
  GoToBluetoothStart = "GoToBluetoothStart",
  Close = "Close",

  // Web USB Flashing events
  WebUsbChooseMicrobit = "WebUsbChooseMicrobit",
  FlashingInProgress = "FlashingInProgress",
  ConnectBattery = "ConnectBattery",

  // Web USB Flashing failure events
  TryAgainReplugMicrobit = "TryAgainReplugMicrobit",
  TryAgainCloseTabs = "TryAgainCloseTabs",
  TryAgainSelectMicrobit = "TryAgainSelectMicrobit",
  InstructManualFlashing = "InstructManualFlashing",
  BadFirmware = "BadFirmware",
  MicrobitUnsupported = "MicrobitUnsupported",

  // Bluetooth connection event
  ConnectingBluetooth = "ConnectingBluetooth",

  // Connecting microbits for radio connection
  ConnectingMicrobits = "ConnectingMicrobits",

  // Connection failure event
  ConnectFailed = "ConnectFailed",
  ReconnectAutoFail = "ReconnectAutoFail",
  ReconnectManualFail = "ReconnectManualFail",
  ReconnectFailedTwice = "ReconnectFailedTwice",
}

export interface ConnectionStage {
  // For connection flow
  flowStep: ConnectionFlowStep;
  flowType: ConnectionFlowType;
  // Number of times there have been consecutive reconnect fails
  // for determining which reconnection dialog to show
  reconnectFailStreak: number;

  // Compatibility
  isWebBluetoothSupported: boolean;
  isWebUsbSupported: boolean;

  // Connection state
  status: ConnectionStatus;
  connType: "bluetooth" | "radio";
  bluetoothDeviceId?: number;
  bluetoothMicrobitName?: string;
  radioBridgeDeviceId?: number;
  radioRemoteDeviceId?: number;
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

const getInitialConnectionStageValue = (
  microbitName: string | undefined
): ConnectionStage => ({
  flowStep: ConnectionFlowStep.None,
  flowType: ConnectionFlowType.Bluetooth,
  reconnectFailStreak: 0,
  status: ConnectionStatus.None,
  bluetoothMicrobitName: microbitName,
  connType: "bluetooth",
  isWebBluetoothSupported: true,
  isWebUsbSupported: true,
});

export const ConnectionStageProvider = ({
  children,
}: ConnectionStageProviderProps) => {
  const [val, setMicrobitName] = useStorage<{
    value?: string;
  }>("local", "microbitName", { value: undefined });
  const [connectionStage, setConnStage] = useState<ConnectionStage>(
    getInitialConnectionStageValue(val.value)
  );
  const setConnectionStage = useCallback(
    (connStage: ConnectionStage) => {
      setMicrobitName({ value: connStage.bluetoothMicrobitName });
      setConnStage(connStage);
    },
    [setMicrobitName]
  );

  return (
    <ConnectionStageContext.Provider
      value={[connectionStage, setConnectionStage]}
    >
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
  const navigate = useNavigate();

  const actions = useMemo(() => {
    return new ConnectionStageActions(
      new ConnectActions(logging),
      navigate,
      stage,
      setStage
    );
  }, [logging, navigate, stage, setStage]);

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
