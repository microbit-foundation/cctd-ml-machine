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

  get = () => this.connections;

  setConnection = (
    programType: ProgramType,
    conn: {
      status?: ConnStatus;
      type: "bluetooth" | "radio";
      remoteDeviceId?: RadioConnection["remoteDeviceId"];
    }
  ) => {
    this.setConnections({
      [programType]: {
        status: ConnStatus.Disconnected,
        ...this.connections[programType],
        ...conn,
      } as Connection,
    });
  };

  isConnected = (programType: ProgramType): boolean => {
    return this.connections[programType]?.status === ConnStatus.Connected;
  };
}
