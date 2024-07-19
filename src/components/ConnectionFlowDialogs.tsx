import { useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  ConnEvent,
  ConnectionFlowStep,
  ConnectionFlowType,
  ConnectionStage,
  useConnectionStage,
} from "../connection-stage-hooks";
import BrokenFirmwareDialog from "./BrokenFirmwareDialog";
import ConnectBatteryDialog from "./ConnectBatteryDialog";
import ConnectCableDialog from "./ConnectCableDialog";
import DownloadingDialog from "./DownloadingDialog";
import EnterBluetoothPatternDialog from "./EnterBluetoothPatternDialog";
import LoadingDialog from "./LoadingDialog";
import ManualFlashingDialog from "./ManualFlashingDialog";
import ReconnectErrorDialog from "./ReconnectErrorDialog";
import SelectMicrobitBluetoothDialog from "./SelectMicrobitBluetoothDialog";
import SelectMicrobitUsbDialog from "./SelectMicrobitUsbDialog";
import TryAgainDialog from "./TryAgainDialog";
import UnsupportedMicrobitDialog from "./UnsupportedMicrobitDialog";
import WebUsbBluetoothUnsupportedDialog from "./WebUsbBluetoothUnsupportedDialog";
import WhatYouWillNeedDialog from "./WhatYouWillNeedDialog";

const ConnectionDialogs = () => {
  const { stage, actions } = useConnectionStage();
  const dispatch = actions.dispatchEvent;
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const { isOpen, onClose: onCloseDialog, onOpen } = useDisclosure();
  const [microbitName, setMicrobitName] = useState<string | undefined>(
    stage.microbitNames.length > 0 ? stage.microbitNames[0] : undefined
  );
  const onClose = useCallback(() => {
    dispatch(ConnEvent.Close);
    onCloseDialog();
  }, [dispatch, onCloseDialog]);

  useEffect(() => {
    if (stage.flowStep !== ConnectionFlowStep.None && !isOpen) {
      onOpen();
    }
    if (stage.flowStep === ConnectionFlowStep.None && isOpen) {
      onClose();
    }
  }, [isOpen, onClose, onOpen, stage]);

  const progressCallback = useCallback(
    (progress: number) => {
      if (stage.flowStep !== ConnectionFlowStep.FlashingInProgress) {
        dispatch(ConnEvent.FlashingInProgress);
      }
      setFlashProgress(progress * 100);
    },
    [dispatch, stage.flowStep]
  );

  const onFlashSuccess = useCallback(({ microbitNames }: ConnectionStage) => {
    // Inferring microbit name saves the user from entering the pattern
    if (microbitNames.length > 0) {
      setMicrobitName(microbitNames[0]);
    }
  }, []);

  async function connectAndFlash(): Promise<void> {
    await actions.connectAndflashMicrobit(progressCallback, onFlashSuccess);
  }

  const onChangeMicrobitName = useCallback(
    (name: string) => {
      actions.setMicrobitName(name);
      setMicrobitName(name);
    },
    [actions]
  );

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

  const dialogCommonProps = { isOpen, onClose };

  switch (stage.flowStep) {
    case ConnectionFlowStep.ReconnectFailedTwice:
    case ConnectionFlowStep.Start: {
      return (
        <WhatYouWillNeedDialog
          type={
            stage.flowType === ConnectionFlowType.Bluetooth
              ? "bluetooth"
              : "radio"
          }
          {...dialogCommonProps}
          onLinkClick={
            stage.isWebBluetoothSupported && stage.isWebUsbSupported
              ? onSwitchTypeClick
              : undefined
          }
          onNextClick={onNextClick}
          reconnect={stage.flowStep === ConnectionFlowStep.ReconnectFailedTwice}
        />
      );
    }
    case ConnectionFlowStep.ConnectCable: {
      const commonProps = { onBackClick, onNextClick, ...dialogCommonProps };
      return (
        <ConnectCableDialog
          {...commonProps}
          type={stage.flowType}
          onSkip={onSkip}
          onSwitch={onSwitchTypeClick}
        />
      );
    }
    case ConnectionFlowStep.WebUsbFlashingTutorial: {
      return (
        <SelectMicrobitUsbDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={connectAndFlash}
        />
      );
    }
    case ConnectionFlowStep.ManualFlashingTutorial: {
      return (
        <ManualFlashingDialog
          {...dialogCommonProps}
          onNextClick={onNextClick}
          onBackClick={onBackClick}
        />
      );
    }
    case ConnectionFlowStep.ConnectBattery: {
      return (
        <ConnectBatteryDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={onNextClick}
        />
      );
    }
    case ConnectionFlowStep.EnterBluetoothPattern: {
      return (
        <EnterBluetoothPatternDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={onNextClick}
          microbitName={microbitName}
          onChangeMicrobitName={onChangeMicrobitName}
        />
      );
    }
    case ConnectionFlowStep.ConnectBluetoothTutorial: {
      return (
        <SelectMicrobitBluetoothDialog
          {...dialogCommonProps}
          onBackClick={onBackClick}
          onNextClick={actions.connectBluetooth}
        />
      );
    }
    case ConnectionFlowStep.WebUsbChooseMicrobit: {
      // Browser dialog is shown, no custom dialog shown at the same time
      return <></>;
    }
    case ConnectionFlowStep.FlashingInProgress: {
      const headingIdVariations = {
        [ConnectionFlowType.Bluetooth]: "connectMB.usbDownloading.header",
        [ConnectionFlowType.RadioRemote]: "connectMB.usbDownloadingMB1.header",
        [ConnectionFlowType.RadioBridge]: "connectMB.usbDownloadingMB2.header",
      };
      return (
        <DownloadingDialog
          headingId={headingIdVariations[stage.flowType]}
          isOpen={isOpen}
          progress={flashProgress}
        />
      );
    }
    case ConnectionFlowStep.ConnectingBluetooth: {
      return (
        <LoadingDialog
          isOpen={isOpen}
          headingId="connectMB.bluetooth.heading"
        />
      );
    }
    case ConnectionFlowStep.ConnectingMicrobits: {
      return (
        <LoadingDialog isOpen={isOpen} headingId="connectMB.radio.heading" />
      );
    }
    case ConnectionFlowStep.TryAgainBluetoothConnect:
    case ConnectionFlowStep.TryAgainReplugMicrobit:
    case ConnectionFlowStep.TryAgainSelectMicrobit:
    case ConnectionFlowStep.TryAgainCloseTabs: {
      return (
        <TryAgainDialog
          {...dialogCommonProps}
          onTryAgain={onTryAgain}
          type={stage.flowStep}
        />
      );
    }
    case ConnectionFlowStep.BadFirmware: {
      return (
        <BrokenFirmwareDialog
          {...dialogCommonProps}
          onSkip={onInstructManualFlashing}
          onTryAgain={onTryAgain}
        />
      );
    }
    case ConnectionFlowStep.MicrobitUnsupported: {
      return (
        <UnsupportedMicrobitDialog
          {...dialogCommonProps}
          onStartBluetoothClick={onStartBluetooth}
          isBluetoothSupported={stage.isWebBluetoothSupported}
        />
      );
    }
    case ConnectionFlowStep.WebUsbBluetoothUnsupported: {
      return <WebUsbBluetoothUnsupportedDialog {...dialogCommonProps} />;
    }
    // TODO: Reconnect dialogs
    case ConnectionFlowStep.ReconnectManualFail:
    case ConnectionFlowStep.ReconnectAutoFail: {
      return (
        <ReconnectErrorDialog
          {...dialogCommonProps}
          onReconnect={actions.reconnect}
          flowType={stage.flowType}
          errorStep={stage.flowStep}
        />
      );
    }
  }
};

export default ConnectionDialogs;
