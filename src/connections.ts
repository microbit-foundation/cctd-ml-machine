import {
  Connection,
  ConnectionStatus,
  ConnectionType,
  ConnectionsState,
  ProgramType,
  RadioConnection,
} from "./connections-hooks";

export class Connections {
  constructor(
    private connections: ConnectionsState,
    private setConnections: (state: ConnectionsState) => void
  ) {}

  private isValidConnection = (v: unknown): v is Connection => {
    if (typeof v !== "object") {
      return false;
    }
    const objValue = v as object;
    if (
      !("status" in objValue) ||
      !("type" in objValue) ||
      !("reconnectFailStreak" in objValue) ||
      !(
        objValue.type === "bluetooth" ||
        (objValue.type === "radio" && "remoteDeviceId" in objValue)
      )
    ) {
      return false;
    }
    return true;
  };

  setConnection = (program: ProgramType, conn: Partial<Connection>) => {
    const existingConn = this.connections[program];
    const newConnection = {
      ...existingConn,
      ...conn,
    } as Connection;
    if (!this.isValidConnection(newConnection)) {
      throw new Error(
        `Invalid new connection state: ${JSON.stringify(newConnection)}`
      );
    }
    this.setConnections({ [program]: newConnection });
  };

  setConnectingOrReconnecting = (
    program: ProgramType,
    type: ConnectionType
  ) => {
    const existingConn = this.connections[program];
    // Update status to reconnecting if it has been connected before
    this.setConnection(program, {
      type,
      status:
        existingConn.status === ConnectionStatus.None
          ? ConnectionStatus.Connecting
          : ConnectionStatus.Reconnecting,
    });
  };

  setConnected = (program: ProgramType) => {
    this.setConnection(program, { status: ConnectionStatus.Connected });
  };

  getRemoteDeviceId = (
    programType: ProgramType
  ): RadioConnection["remoteDeviceId"] | undefined => {
    const inputConnection = this.connections[programType];
    return inputConnection.type === "radio"
      ? inputConnection.remoteDeviceId
      : undefined;
  };

  isConnected = (programType: ProgramType): boolean => {
    return this.connections[programType].status === ConnectionStatus.Connected;
  };

  setConnectionFailedStreak = (programType: ProgramType): number => {
    const existingConn = this.connections[programType];
    const reconnectFailStreak =
      existingConn.status === ConnectionStatus.Reconnecting
        ? existingConn.reconnectFailStreak + 1
        : existingConn.reconnectFailStreak;
    this.setConnection(programType, {
      status: ConnectionStatus.Disconnected,
      reconnectFailStreak,
    });
    return reconnectFailStreak;
  };
}
