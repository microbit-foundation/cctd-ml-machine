/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { createMakeCodeURL, MakeCodeFrameDriver } from '@microbit/makecode-embed';
import Microbits from '../../../lib/microbit-interfacing/Microbits';
import FileUtility from '../../../lib/utils/FileUtility';
import { navigate, Paths } from '../../../router/Router';
import { getControllers } from '../../../backend/interface-adapter/MLMachine';

export const flashHexContent = async (hexContent: string) => {
  const microbitController = getControllers().getMicrobitController();
  try {
    await Microbits.linkMicrobit();
    Microbits.flashHexToLinked(progress => {
      const connection = microbitController.getMicrobitConnectionState().get();
      connection.setFlashingProgress(progress);
      microbitController.setMicrobitConnection(connection);
    }, hexContent);
  } catch (error) {
    console.log(error);
  }
};

export const downloadHexContent = (hexContent: string, filename: string) => {
  try {
    FileUtility.downloadFile(hexContent, filename);
  } catch (err) {
    console.error('Failed to save .hex file', err);
  }
};

export const createFrameDriver = (iframe: HTMLIFrameElement | undefined) => {
  const controllers = getControllers();
  const makeCodeController = controllers.getMakeCodeController();

  const onBackButtonPressed = () => navigate(Paths.MODEL);
  const driverRef = new MakeCodeFrameDriver(
    {
      onBack: onBackButtonPressed,
      controllerId: 'MlMachine',
      initialProjects: async () => [makeCodeController.getMakeCodeProject().get()],
      // When the editor loads, hide the simulator to make more space
      onEditorContentLoaded: e => driverRef.hideSimulator(),
      onWorkspaceSave: e => makeCodeController.setMakeCodeProject(e.project),
      onDownload: ({ hex }) => flashHexContent(hex),
      onSave: ({ name, hex }) => downloadHexContent(hex, name),
    },
    () => iframe,
  );
  return driverRef;
};
export const createMakeCodeIframe = () => {
  const iframe = document.createElement('iframe');
  iframe.allow = 'usb; autoplay; camera; microphone;';
  iframe.src = createMakeCodeURL(
    'https://makecode.microbit.org',
    undefined, // Version.
    undefined, // Language.
    2, // Controller.
    undefined, // Query params.
  );

  iframe.width = '100%';
  iframe.height = '100%';
  return iframe;
};
