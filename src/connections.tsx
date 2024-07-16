import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ConnEvent, ConnectionActions } from "./connection-flow";
import { useStorage } from "./hooks/use-storage";
import { isArray } from "./utils";

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

export interface BluetoothConn {
  status: ConnStatus;
  program: ProgramType;
  type: ConnType.Bluetooth;
  bluetoothPattern: boolean[];
}

interface RadioConn {
  status: ConnStatus;
  program: ProgramType;
  type: Exclude<ConnType, ConnType.Bluetooth>;
}

export type Conn = BluetoothConn | RadioConn;

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

export const isValidStoredConnections = (
  v: unknown
): v is StoredConnections => {
  if (typeof v !== "object") {
    return false;
  }
  const valueObject = v as object;
  if (!("connections" in valueObject)) {
    return false;
  }
  const conns = valueObject.connections;
  if (!isArray(conns)) {
    return false;
  }
  const array = conns as unknown[];
  for (const item of array) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    if (!("program" in item) || !("type" in item) || !("status" in item)) {
      return false;
    }
  }
  return true;
};

interface StoredConnections {
  connections: Conn[];
}

export const ConnectionProvider = ({ children }: ConnectionProviderProps) => {
  // TODO: Check bt and usb compatibility
  const isWebBluetoothSupported = true;
  const isWebUsbSupported = true;

  // Connections are stored in local storage to save bluetooth pattern
  const [storedConnections, setStoredConnections] =
    useStorage<StoredConnections>(
      "local",
      "connections",
      { connections: [] },
      isValidStoredConnections
    );

  const [connState, setConnState] = useState<ConnState>({
    type: isWebBluetoothSupported ? ConnType.Bluetooth : ConnType.RadioRemote,
    program: ProgramType.CollectData,
    stage: ConnStage.None,
    isWebUsbSupported,
    isWebBluetoothSupported,
    connections: storedConnections.connections,
  });
  const setState = useCallback(
    (newState: ConnState) => {
      setStoredConnections({ connections: newState.connections });
      setConnState(newState);
    },
    [setStoredConnections]
  );
  return (
    <ConnectionContext.Provider value={{ state: connState, setState }}>
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
