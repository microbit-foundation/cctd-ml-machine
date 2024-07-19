import {
  DeviceError,
  MicrobitWebUSBConnection,
} from "@microbit/microbit-connection";
import { ConnectionFlowType } from "./connection-stage-hooks";
import { Connections } from "./connections";
import { ConnectionStatus, ProgramType } from "./connections-hooks";
import { getFlashDataSource } from "./device/get-hex-file";
import { Logging } from "./logging/logging";

export enum ConnectAndFlashResult {
  Success,
  Failed,
  ErrorMicrobitUnsupported,
  ErrorBadFirmware,
  ErrorNoDeviceSelected,
  ErrorUnableToClaimInterface,
}

type ConnectAndFlashFailResult = Exclude<
  ConnectAndFlashResult,
  ConnectAndFlashResult.Success
>;

export enum ConnectResult {
  Success,
  ManualConnectFailed,
  AutomaticConnectFailed,
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class ConnectActions {
  public device: MicrobitWebUSBConnection | undefined;
  constructor(private logging: Logging, private connections: Connections) {}

  requestUSBConnectionAndFlash = async (
    hexType: ConnectionFlowType,
    progressCallback: (progress: number) => void
  ): Promise<
    | { result: ConnectAndFlashResult.Success; deviceId: string }
    | { result: ConnectAndFlashFailResult; deviceId?: string }
  > => {
    try {
      this.device = new MicrobitWebUSBConnection({ logging: this.logging });
      await this.device.connect();
      const result = await this.flashMicrobit(hexType, progressCallback);
      // Save remote micro:bit device id is stored for passing it to bridge micro:bit
      const deviceId = this.device.getDeviceId()?.toString();
      if (!deviceId) {
        return { result: ConnectAndFlashResult.Failed };
      }
      return { result, deviceId };
    } catch (e) {
      this.logging.error(
        `USB request device failed/cancelled: ${JSON.stringify(e)}`
      );
      return { result: this.handleConnectAndFlashError(e) };
    }
  };

  private flashMicrobit = async (
    flowType: ConnectionFlowType,
    progress: (progress: number) => void
  ): Promise<ConnectAndFlashResult> => {
    if (!this.device) {
      return ConnectAndFlashResult.Failed;
    }
    const data = getFlashDataSource(flowType);

    if (!data) {
      return ConnectAndFlashResult.ErrorMicrobitUnsupported;
    }
    try {
      await this.device.flash(data, {
        partial: true,
        progress: (v) => progress(v ?? 100),
      });
      return ConnectAndFlashResult.Success;
    } catch (e) {
      this.logging.error(`Flashing failed: ${JSON.stringify(e)}`);
      return ConnectAndFlashResult.Failed;
    }
  };

  private handleConnectAndFlashError = (
    err: unknown
  ): ConnectAndFlashFailResult => {
    if (err instanceof DeviceError) {
      switch (err.code) {
        case "clear-connect":
          return ConnectAndFlashResult.ErrorUnableToClaimInterface;
        case "no-device-selected":
          return ConnectAndFlashResult.ErrorNoDeviceSelected;
        case "update-req":
          return ConnectAndFlashResult.ErrorBadFirmware;
        default:
          return ConnectAndFlashResult.Failed;
      }
    }
    return ConnectAndFlashResult.Failed;
  };

  // TODO: Replace with real connecting logic
  connectMicrobitsSerial = async (deviceId: string): Promise<ConnectResult> => {
    await delay(5000);

    // TODO: Use deviceId to assign to connect microbits
    if (!deviceId) {
      return ConnectResult.ManualConnectFailed;
    }
    return ConnectResult.ManualConnectFailed;
  };

  // TODO: Replace with real connecting logic
  connectBluetooth = async (): Promise<ConnectResult> => {
    await delay(5000);

    const hasFailed = false;
    if (hasFailed) {
      return ConnectResult.ManualConnectFailed;
    }
    return ConnectResult.Success;
  };

  // TODO: Replace with real disconnect logic
  disconnect = () => {
    this.connections.setConnection(ProgramType.Input, {
      status: ConnectionStatus.Disconnected,
    });
  };
}
