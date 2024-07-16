import { ReactNode, createContext, useContext, useReducer } from "react";
import {
  ConnEvent,
  ConnStage,
  ConnState,
  ConnType,
  connectionDialogReducer,
} from "./connection-flow";

type ConnectionFlowContextValue = {
  state: ConnState;
  dispatch: React.Dispatch<ConnEvent>;
};

export const ConnectionFlowContext =
  createContext<ConnectionFlowContextValue | null>(null);

interface ConnectionFlowProviderProps {
  children: ReactNode;
}

export const ConnectionFlowProvider = ({
  children,
}: ConnectionFlowProviderProps) => {
  // TODO: Check bt and usb compatibility
  const isWebBluetoothSupported = true;
  const isWebUsbSupported = true;

  const [state, dispatch] = useReducer(connectionDialogReducer, {
    type: isWebBluetoothSupported ? ConnType.Bluetooth : ConnType.RadioRemote,
    stage: ConnStage.None,
    isWebUsbSupported,
    isWebBluetoothSupported,
  });
  return (
    <ConnectionFlowContext.Provider value={{ state, dispatch }}>
      {children}
    </ConnectionFlowContext.Provider>
  );
};

export const useConnectionFlow = (): ConnectionFlowContextValue => {
  const connFlow = useContext(ConnectionFlowContext);
  if (!connFlow) {
    throw new Error("Missing provider");
  }
  return connFlow;
};
