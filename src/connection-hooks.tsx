import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import {
  ConnStage,
  ConnectionFlowActions,
  ConnectionFlowState,
} from "./connection-flow";
import { useLogging } from "./logging/logging-hooks";
import {
  ConnType,
  Connections,
  ConnectionsState,
  ProgramType,
} from "./connections";
import { ConnectActions } from "./connect-actions";

type ConnectionContextValue = {
  // Used for storing the state of connections
  connectionsState: ConnectionsState;
  setConnectionsState: (state: ConnectionsState) => void;

  // Used for connection flow
  connectionFlowState: ConnectionFlowState;
  setConnectionFlowState: (state: ConnectionFlowState) => void;
};

export const ConnectionContext = createContext<ConnectionContextValue | null>(
  null
);

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider = ({ children }: ConnectionProviderProps) => {
  // TODO: Check bt and usb compatibility
  const isWebBluetoothSupported = true;
  const isWebUsbSupported = true;

  const [connectionsState, setConnectionsState] = useState<ConnectionsState>(
    {}
  );

  const [connectionFlowState, setConnectionFlowState] =
    useState<ConnectionFlowState>({
      type: isWebBluetoothSupported ? ConnType.Bluetooth : ConnType.RadioRemote,
      stage: ConnStage.None,
      isWebUsbSupported,
      isWebBluetoothSupported,
    });
  return (
    <ConnectionContext.Provider
      value={{
        connectionFlowState,
        setConnectionFlowState,
        connectionsState,
        setConnectionsState,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = (): {
  connections: Connections;
  isInputConnected: boolean;
} => {
  const connContextValue = useContext(ConnectionContext);
  if (!connContextValue) {
    throw new Error("Missing provider");
  }
  const { connectionsState, setConnectionsState } = connContextValue;
  const conn = useMemo(
    () => new Connections(connectionsState, setConnectionsState),
    [connectionsState, setConnectionsState]
  );
  const isInputConnected = useMemo(
    () => conn.isConnected(ProgramType.Input),
    [conn]
  );
  return { connections: conn, isInputConnected };
};

export const useConnectionFlow = (): {
  state: ConnectionFlowState;
  actions: ConnectionFlowActions;
} => {
  const connContextValue = useContext(ConnectionContext);
  if (!connContextValue) {
    throw new Error("Missing provider");
  }
  const { connectionFlowState, setConnectionFlowState } = connContextValue;
  const logging = useLogging();
  const { connections } = useConnections();

  const actions = useMemo(() => {
    const connectActions = new ConnectActions(logging, connections);

    return new ConnectionFlowActions(
      connectActions,
      connectionFlowState,
      setConnectionFlowState
    );
  }, [logging, connections, connectionFlowState, setConnectionFlowState]);

  return {
    state: connectionFlowState,
    actions,
  };
};
