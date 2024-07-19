import {
  DeviceError,
  ConnectionStatus as DeviceConnectionStatus,
  MicrobitWebBluetoothConnection,
  MicrobitWebUSBConnection,
} from "@microbit/microbit-connection";
import { ConnectionFlowType } from "./connection-stage-hooks";
import { Connections } from "./connections";
import { ConnectionStatus, ProgramType } from "./connections-hooks";
import { getFlashDataSource } from "./device/get-hex-file";
import { Logging } from "./logging/logging";
import { AccelerometerDataEvent } from "../../connection/build/accelerometer";

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
  public usb: MicrobitWebUSBConnection;
  public bluetooth: MicrobitWebBluetoothConnection;
  private accelerometerListener = (e: AccelerometerDataEvent) => {
    console.log(e.data);
  };

  constructor(private logging: Logging, private connections: Connections) {
    this.usb = new MicrobitWebUSBConnection({ logging });
    this.bluetooth = new MicrobitWebBluetoothConnection({ logging });
  }

  requestUSBConnectionAndFlash = async (
    hexType: ConnectionFlowType,
    progressCallback: (progress: number) => void
  ): Promise<
    | { result: ConnectAndFlashResult.Success; deviceId: string }
    | { result: ConnectAndFlashFailResult; deviceId?: string }
  > => {
    try {
      // TODO: move this to init point
      await this.usb.initialize();
      await this.usb.connect();
      const result = await this.flashMicrobit(hexType, progressCallback);
      // Save remote micro:bit device id is stored for passing it to bridge micro:bit
      const deviceId = this.usb.getDeviceId()?.toString();
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
    if (!this.usb) {
      return ConnectAndFlashResult.Failed;
    }
    const data = getFlashDataSource(flowType);

    if (!data) {
      return ConnectAndFlashResult.ErrorMicrobitUnsupported;
    }
    try {
      await this.usb.flash(data, {
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
    // TODO: move this to init point
    await this.bluetooth.initialize();
    this.bluetooth.addEventListener(
      "accelerometerdatachanged",
      this.accelerometerListener
    );
    await this.bluetooth.connect({
      // TODO: name
    });
    if (this.bluetooth.status === DeviceConnectionStatus.CONNECTED) {
      return ConnectResult.Success;
    }
    return ConnectResult.ManualConnectFailed;
  };

  // TODO: Replace with real disconnect logic
  disconnect = () => {
    this.connections.setConnection(ProgramType.Input, {
      status: ConnectionStatus.Disconnected,
    });
  };
}
