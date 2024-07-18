import {
  BluetoothConnectResult,
  ConnectActions,
  ConnectAndFlashResult,
} from "./connect-actions";
import { ConnType } from "./connections";

export interface ConnectionFlowState {
  stage: ConnStage;
  type: ConnType;
  isWebUsbSupported: boolean;
  isWebBluetoothSupported: boolean;
}

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

export enum ConnEvent {
  // User triggered events
  Start,
  Switch,
  Next,
  Back,
  SkipFlashing,
  TryAgain,
  GoToBluetoothStart,
  Close,

  // Web USB Flashing events
  WebUsbChooseMicrobit,
  FlashingInProgress,
  FlashingComplete,

  // Web USB Flashing failure events
  TryAgainReplugMicrobit,
  TryAgainCloseTabs,
  TryAgainSelectMicrobit,
  InstructManualFlashing,
  BadFirmware,
  MicrobitUnsupported,

  // Bluetooth connection event
  ConnectingBluetooth,

  // Bluetooth connection failure event
  TryAgainBluetoothConnect,

  // Connecting microbits for radio connection
  ConnectingMicrobits,
}

type StageAndType = Pick<ConnectionFlowState, "stage" | "type">;

export class ConnectionFlowActions {
  constructor(
    private actions: ConnectActions,
    private connState: ConnectionFlowState,
    private setConnState: (state: ConnectionFlowState) => void
  ) {}

  start = () => {
    this.dispatchEvent(ConnEvent.Start);
  };

  dispatchEvent = (event: ConnEvent) => {
    this.setConnState(getUpdatedConnState(this.connState, event));
  };

  connectAndflashMicrobit = async (
    progressCallback: (progress: number) => void
  ) => {
    this.dispatchEvent(ConnEvent.WebUsbChooseMicrobit);
    const result = await this.actions.requestUSBConnectionAndFlash(
      this.connState.type,
      progressCallback
    );
    if (
      this.connState.type === ConnType.Bluetooth &&
      result !== ConnectAndFlashResult.Success
    ) {
      return this.dispatchEvent(ConnEvent.InstructManualFlashing);
    }
    switch (result) {
      case ConnectAndFlashResult.ErrorMicrobitUnsupported:
        return this.dispatchEvent(ConnEvent.MicrobitUnsupported);
      case ConnectAndFlashResult.ErrorBadFirmware:
        return this.dispatchEvent(ConnEvent.BadFirmware);
      case ConnectAndFlashResult.ErrorNoDeviceSelected:
        return this.dispatchEvent(ConnEvent.TryAgainSelectMicrobit);
      case ConnectAndFlashResult.ErrorUnableToClaimInterface:
        return this.dispatchEvent(ConnEvent.TryAgainCloseTabs);
      case ConnectAndFlashResult.Failed:
        return this.dispatchEvent(ConnEvent.TryAgainReplugMicrobit);
      case ConnectAndFlashResult.Success:
        this.dispatchEvent(ConnEvent.FlashingComplete);
        break;
    }
    // TODO: not sure if connecting microbits should be triggered here
    if (this.connState.type === ConnType.RadioBridge) {
      await this.actions.connectMicrobitsSerial();
    }
  };

  connectBluetooth = async (onSuccess: () => void) => {
    this.dispatchEvent(ConnEvent.ConnectingBluetooth);
    const result = await this.actions.connectBluetooth();
    if (result === BluetoothConnectResult.Success) {
      onSuccess();
    } else {
      this.dispatchEvent(ConnEvent.TryAgainBluetoothConnect);
    }
  };

  getDeviceId = () => {
    return this.actions.device?.getDeviceId();
  };
}

export const getUpdatedConnState = (
  state: ConnectionFlowState,
  event: ConnEvent
) => {
  switch (event) {
    case ConnEvent.Start:
      return {
        ...state,
        stage:
          !state.isWebBluetoothSupported && !state.isWebUsbSupported
            ? ConnStage.WebUsbBluetoothUnsupported
            : ConnStage.Start,
      };
    case ConnEvent.Close:
      return { ...state, stage: ConnStage.None };
    case ConnEvent.SkipFlashing:
      return { ...state, stage: ConnStage.ConnectBattery };
    case ConnEvent.FlashingInProgress:
      return { ...state, stage: ConnStage.FlashingInProgress };
    case ConnEvent.InstructManualFlashing:
      return { ...state, stage: ConnStage.ManualFlashingTutorial };
    case ConnEvent.WebUsbChooseMicrobit:
      return { ...state, stage: ConnStage.WebUsbChooseMicrobit };
    case ConnEvent.ConnectingBluetooth:
      return { ...state, stage: ConnStage.ConnectingBluetooth };
    case ConnEvent.ConnectingMicrobits:
      return { ...state, stage: ConnStage.ConnectingMicrobits };
    case ConnEvent.Next:
      return { ...state, ...getNextStageAndType(state, 1) };
    case ConnEvent.Back:
      return { ...state, ...getNextStageAndType(state, -1) };
    case ConnEvent.Switch:
      return {
        ...state,
        type:
          state.type === ConnType.Bluetooth
            ? ConnType.RadioRemote
            : ConnType.Bluetooth,
      };
    case ConnEvent.GoToBluetoothStart:
      return {
        ...state,
        stage: ConnStage.Start,
        type: ConnType.Bluetooth,
      };
    case ConnEvent.FlashingComplete:
      return {
        ...state,
        stage:
          state.type === ConnType.RadioRemote
            ? ConnStage.ConnectingMicrobits
            : ConnStage.ConnectBattery,
      };
    case ConnEvent.TryAgain:
      return {
        ...state,
        stage:
          state.stage === ConnStage.TryAgainBluetoothConnect
            ? ConnStage.ConnectBluetoothTutorial
            : ConnStage.ConnectCable,
      };
    default:
      return state;
  }
};

const getStageAndTypeOrder = (state: ConnectionFlowState): StageAndType[] => {
  const { RadioRemote, RadioBridge, Bluetooth } = ConnType;
  if (state.type === ConnType.Bluetooth) {
    return [
      { stage: ConnStage.Start, type: Bluetooth },
      { stage: ConnStage.ConnectCable, type: Bluetooth },
      // Only bluetooth mode has this fallback, the radio bridge mode requires working WebUSB.
      !state.isWebUsbSupported ||
      state.stage === ConnStage.ManualFlashingTutorial
        ? { stage: ConnStage.ManualFlashingTutorial, type: Bluetooth }
        : { stage: ConnStage.WebUsbFlashingTutorial, type: Bluetooth },
      { stage: ConnStage.ConnectBattery, type: Bluetooth },
      { stage: ConnStage.EnterBluetoothPattern, type: Bluetooth },
      { stage: ConnStage.ConnectBluetoothTutorial, type: Bluetooth },
    ];
  }
  return [
    { stage: ConnStage.Start, type: RadioRemote },
    { stage: ConnStage.ConnectCable, type: RadioRemote },
    { stage: ConnStage.WebUsbFlashingTutorial, type: RadioRemote },
    { stage: ConnStage.ConnectBattery, type: RadioRemote },
    { stage: ConnStage.ConnectCable, type: RadioBridge },
    { stage: ConnStage.WebUsbFlashingTutorial, type: RadioBridge },
  ];
};

const getStageAndTypeIdx = (
  { stage, type }: StageAndType,
  order: StageAndType[]
) => {
  for (let idx = 0; idx < order.length; idx++) {
    const step = order[idx];
    if (step.stage === stage && step.type === type) {
      return idx;
    }
  }
  throw new Error("Should be able to match stage and type again order");
};

const getNextStageAndType = (
  state: ConnectionFlowState,
  step: number
): StageAndType => {
  const order = getStageAndTypeOrder(state);
  const curr = { stage: state.stage, type: state.type };
  const currIdx = getStageAndTypeIdx(curr, order);
  const newIdx = currIdx + step;
  // If impossible step stage, stick to current step
  if (newIdx === order.length || newIdx < 0) {
    return curr;
  }
  return order[newIdx];
};
