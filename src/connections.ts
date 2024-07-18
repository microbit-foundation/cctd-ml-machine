export enum ConnType {
  Bluetooth,
  RadioBridge,
  RadioRemote,
}

export enum ConnStatus {
  Disconnected,
  Connected,
}

export interface BluetoothConnection {
  status: ConnStatus;
  type: "bluetooth";
}
export interface RadioConnection {
  status: ConnStatus;
  type: "radio";
  // Remote micro:bit device id is stored for passing it to bridge micro:bit
  remoteDeviceId: string;
}

export type Connection = BluetoothConnection | RadioConnection;

export enum ProgramType {
  Input,
}

export interface ConnectionsState {
  [ProgramType.Input]?: Connection;
}

export class Connections {
  constructor(
    private connections: ConnectionsState,
    private setConnections: (state: ConnectionsState) => void
  ) {}

  setConnection = (
    programType: ProgramType,
    conn: {
      status?: ConnStatus;
      type?: "bluetooth" | "radio";
      remoteDeviceId?: RadioConnection["remoteDeviceId"];
    }
  ) => {
    const newConnection = {
      status: ConnStatus.Disconnected,
      ...this.connections[programType],
      ...conn,
    };
    if (
      !("status" in newConnection) ||
      !("type" in newConnection) ||
      !("program" in newConnection) ||
      !(newConnection.type === "radio" && !!newConnection.remoteDeviceId)
    ) {
      throw new Error(
        `Invalid new connection state: ${JSON.stringify(newConnection)}`
      );
    }
    this.setConnections({ [programType]: newConnection as Connection });
  };

  getRemoteDeviceId = (
    programType: ProgramType
  ): RadioConnection["remoteDeviceId"] | undefined => {
    const inputConnection = this.connections[programType];
    return inputConnection?.type === "radio"
      ? inputConnection.remoteDeviceId
      : undefined;
  };

  isConnected = (programType: ProgramType): boolean => {
    return this.connections[programType]?.status === ConnStatus.Connected;
  };
}
