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

// For now, we only have one program type, but here we can expand to other
// programs e.g. CollectDataInField
export enum ProgramType {
  CollectData,
}

export enum ConnStatus {
  Disconnected,
  Connected,
}

export interface Conn {
  status: ConnStatus;
  program: ProgramType;
  type: ConnType;
}

export type ConnState = {
  stage: ConnStage;
  type: ConnType;
  program: ProgramType;
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
    program: ProgramType.CollectData,
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
  actions: ConnectionActions;
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
    actions,
  };
};
