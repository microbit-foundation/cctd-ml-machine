import { useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { microbitNameToBluetoothPattern } from "../bt-pattern-utils";
import { ConnEvent, ConnStage } from "../connection-flow";
import { useConnectionFlow } from "../connection-hooks";
import { ConnType } from "../connections";
import BrokenFirmwareDialog from "./BrokenFirmwareDialog";
import ConnectBatteryDialog from "./ConnectBatteryDialog";
import ConnectCableDialog from "./ConnectCableDialog";
import DownloadingDialog from "./DownloadingDialog";
import EnterBluetoothPatternDialog, {
  BluetoothPattern,
} from "./EnterBluetoothPatternDialog";
import LoadingDialog from "./LoadingDialog";
import ManualFlashingDialog from "./ManualFlashingDialog";
import SelectMicrobitBluetoothDialog from "./SelectMicrobitBluetoothDialog";
import SelectMicrobitUsbDialog from "./SelectMicrobitUsbDialog";
import TryAgainDialog from "./TryAgainDialog";
import UnsupportedMicrobitDialog from "./UnsupportedMicrobitDialog";
import WebUsbBluetoothUnsupportedDialog from "./WebUsbBluetoothUnsupportedDialog";
import WhatYouWillNeedDialog from "./WhatYouWillNeedDialog";

const ConnectionDialogs = () => {
  const { state, actions } = useConnectionFlow();
  const dispatch = actions.dispatchEvent;
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const { isOpen, onClose: onCloseDialog, onOpen } = useDisclosure();
  const [bluetoothPattern, setBluetoothPattern] = useState<BluetoothPattern>(
    Array(25).fill(false)
  );

  useEffect(() => {
    if (
      state.stage === ConnStage.Start ||
      state.stage === ConnStage.WebUsbBluetoothUnsupported
    ) {
      onOpen();
    }
  }, [onOpen, state]);

  const progressCallback = useCallback(
    (progress: number) => {
      if (state.stage !== ConnStage.FlashingInProgress) {
        dispatch(ConnEvent.FlashingInProgress);
      }
      setFlashProgress(progress * 100);
    },
    [dispatch, state.stage]
  );

  async function connectAndFlash(): Promise<void> {
    await actions.connectAndflashMicrobit(progressCallback);

    const deviceId = actions.getDeviceId();
    if (!!deviceId && state.type === ConnType.Bluetooth) {
      // Infer pattern from device id saves the user from entering the pattern
      setBluetoothPattern(microbitNameToBluetoothPattern(""));
    }
  }

  // TODO: Flag reconnect failed
  const reconnectFailed = false;
  const onSwitchTypeClick = useCallback(
    () => dispatch(ConnEvent.Switch),
    [dispatch]
  );
  const onBackClick = useCallback(() => dispatch(ConnEvent.Back), [dispatch]);
  const onNextClick = useCallback(() => dispatch(ConnEvent.Next), [dispatch]);
  const onSkip = useCallback(
    () => dispatch(ConnEvent.SkipFlashing),
    [dispatch]
  );
  const onTryAgain = useCallback(
    () => dispatch(ConnEvent.TryAgain),
    [dispatch]
  );
  const onStartBluetooth = useCallback(
    () => dispatch(ConnEvent.GoToBluetoothStart),
    [dispatch]
  );
  const onInstructManualFlashing = useCallback(
    () => dispatch(ConnEvent.InstructManualFlashing),
    [dispatch]
  );
  const onClose = useCallback(() => {
    dispatch(ConnEvent.Close);
    onCloseDialog();
  }, [dispatch, onCloseDialog]);
  const dialogCommonProps = { isOpen, onClose };

  switch (state.stage) {
    case ConnStage.Start: {
      return (
        <WhatYouWillNeedDialog
          type={state.type}
          {...dialogCommonProps}
          onLinkClick={
            state.isWebBluetoothSupported && state.isWebUsbSupported
              ? onSwitchTypeClick
              : undefined
          }
          onNextClick={onNextClick}
          reconnect={reconnectFailed}
        />
      );
    }
    case ConnStage.ConnectCable: {
      const commonProps = { onBackClick, onNextClick, ...dialogCommonProps };
      return (
        <ConnectCableDialog
          {...commonProps}
          type={state.type}
          onSkip={onSkip}
          onSwitch={onSwitchTypeClick}
        />
      );
    }
    case ConnStage.WebUsbFlashingTutorial: {
      return (
        <SelectMicrobitUsbDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={connectAndFlash}
        />
      );
    }
    case ConnStage.ManualFlashingTutorial: {
      return (
        <ManualFlashingDialog
          {...dialogCommonProps}
          onNextClick={onNextClick}
          onBackClick={onBackClick}
        />
      );
    }
    case ConnStage.ConnectBattery: {
      return (
        <ConnectBatteryDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={onNextClick}
        />
      );
    }
    case ConnStage.EnterBluetoothPattern: {
      return (
        <EnterBluetoothPatternDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={onNextClick}
          bluetoothPattern={bluetoothPattern}
          setBluetoothPattern={setBluetoothPattern}
        />
      );
    }
    case ConnStage.ConnectBluetoothTutorial: {
      return (
        <SelectMicrobitBluetoothDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={() => actions.connectBluetooth(onClose)}
        />
      );
    }
    case ConnStage.WebUsbChooseMicrobit: {
      // Browser dialog is shown, no custom dialog shown at the same time
      return <></>;
    }
    case ConnStage.FlashingInProgress: {
      const headingIdVariations = {
        [ConnType.Bluetooth]: "connectMB.usbDownloading.header",
        [ConnType.RadioRemote]: "connectMB.usbDownloadingMB1.header",
        [ConnType.RadioBridge]: "connectMB.usbDownloadingMB2.header",
      };
      return (
        <DownloadingDialog
          headingId={headingIdVariations[state.type]}
          isOpen={isOpen}
          progress={flashProgress}
        />
      );
    }
    case ConnStage.ConnectingBluetooth: {
      return (
        <LoadingDialog
          isOpen={isOpen}
          headingId="connectMB.bluetooth.heading"
        />
      );
    }
    case ConnStage.ConnectingMicrobits: {
      return (
        <LoadingDialog isOpen={isOpen} headingId="connectMB.radio.heading" />
      );
    }
    case ConnStage.TryAgainBluetoothConnect:
    case ConnStage.TryAgainReplugMicrobit:
    case ConnStage.TryAgainSelectMicrobit:
    case ConnStage.TryAgainCloseTabs: {
      return (
        <TryAgainDialog
          onClose={onClose}
          isOpen={isOpen}
          onTryAgain={onTryAgain}
          type={state.stage}
        />
      );
    }
    case ConnStage.BadFirmware: {
      return (
        <BrokenFirmwareDialog
          onClose={onClose}
          isOpen={isOpen}
          onSkip={onInstructManualFlashing}
          onTryAgain={onTryAgain}
        />
      );
    }
    case ConnStage.MicrobitUnsupported: {
      return (
        <UnsupportedMicrobitDialog
          onClose={onClose}
          isOpen={isOpen}
          onStartBluetoothClick={onStartBluetooth}
          isBluetoothSupported={state.isWebBluetoothSupported}
        />
      );
    }
    case ConnStage.WebUsbBluetoothUnsupported: {
      console.log("here");
      return (
        <WebUsbBluetoothUnsupportedDialog isOpen={isOpen} onClose={onClose} />
      );
    }
  }
};

export default ConnectionDialogs;
