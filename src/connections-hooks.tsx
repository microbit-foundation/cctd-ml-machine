import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { Connections } from "./connections";

export enum ConnectionStatus {
  None, // Have not been connected before
  Connecting,
  Connected,
  Disconnected,
  Reconnecting,
}
export type ConnectionType = "bluetooth" | "radio";
export interface BluetoothConnection {
  status: ConnectionStatus;
  type: "bluetooth";
}
export interface RadioConnection {
  status: ConnectionStatus;
  type: "radio";
  // Remote micro:bit device id is stored for passing it to bridge micro:bit
  remoteDeviceId: string;
}

export type Connection = BluetoothConnection | RadioConnection;

export enum ProgramType {
  Input = "input",
}

export interface ConnectionsState {
  [ProgramType.Input]: Connection;
}

type ConnectionsContextValue = [
  ConnectionsState,
  setConnectionsState: (state: ConnectionsState) => void
];

export const ConnectionsContext = createContext<ConnectionsContextValue | null>(
  null
);

interface ConnectionsProviderProps {
  children: ReactNode;
}

const initialConnectionsState: ConnectionsState = {
  input: {
    type: "bluetooth",
    status: ConnectionStatus.None,
  },
};

export const ConnectionsProvider = ({ children }: ConnectionsProviderProps) => {
  const connectionsContextValue = useState<ConnectionsState>(
    initialConnectionsState
  );
  return (
    <ConnectionsContext.Provider value={connectionsContextValue}>
      {children}
    </ConnectionsContext.Provider>
  );
};

export const useConnections = (): {
  state: ConnectionsState;
  connections: Connections;
  inputConnection: Connection;
  isInputConnected: boolean;
} => {
  const connectionsContextValue = useContext(ConnectionsContext);
  if (!connectionsContextValue) {
    throw new Error("Missing provider");
  }
  const [state, setState] = connectionsContextValue;
  const conn = useMemo(
    () => new Connections(state, setState),
    [state, setState]
  );
  const isInputConnected = useMemo(
    () => conn.isConnected(ProgramType.Input),
    [conn]
  );
  return {
    state,
    connections: conn,
    inputConnection: state[ProgramType.Input],
    isInputConnected,
  };
};
