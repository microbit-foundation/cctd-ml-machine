import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { ConnEvent, ConnectionActions } from "./connection-flow";

export enum ConnStage {
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
}

export enum ConnType {
  Bluetooth,
  RadioBridge,
  RadioRemote,
}

export enum ProgramType {
  Input,
  Output,
}

interface BluetoothConn {
  type: ConnType.Bluetooth;
  program: ProgramType;
  microbitName: string; // Taken from bluetooth pattern
}

interface RadioConn {
  type: Exclude<ConnType, ConnType.Bluetooth>;
  program: ProgramType;
}

type Conn = BluetoothConn | RadioConn;

export type ConnState = {
  stage: ConnStage;
  type: ConnType;
  isWebUsbSupported: boolean;
  isWebBluetoothSupported: boolean;
  connections: Conn[];
};

type ConnContextValue = {
  state: ConnState;
  setState: (state: ConnState) => void;
};

export const ConnectionContext = createContext<ConnContextValue | null>(null);

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider = ({ children }: ConnectionProviderProps) => {
  // TODO: Check bt and usb compatibility
  const isWebBluetoothSupported = true;
  const isWebUsbSupported = true;

  const [state, setState] = useState<ConnState>({
    type: isWebBluetoothSupported ? ConnType.Bluetooth : ConnType.RadioRemote,
    stage: ConnStage.None,
    isWebUsbSupported,
    isWebBluetoothSupported,
    connections: [],
  });
  return (
    <ConnectionContext.Provider value={{ state, setState }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionFlow = (): {
  state: ConnState;
  dispatch: (event: ConnEvent) => void;
} => {
  const connContextValue = useContext(ConnectionContext);
  if (!connContextValue) {
    throw new Error("Missing provider");
  }
  const { state, setState } = connContextValue;
  const actions = useMemo(
    () => new ConnectionActions(state, setState),
    [setState, state]
  );
  return {
    state: connContextValue.state,
    dispatch: actions.dispatchConnectFlowEvent,
  };
};
