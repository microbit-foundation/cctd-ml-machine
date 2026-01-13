<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import {
    createMakeCodeURL,
    MakeCodeFrameDriver,
    type MakeCodeProject,
  } from '@microbit/makecode-embed';
  import FileUtility from '../../../lib/repository/FileUtility';
  import { onMount } from 'svelte';
  import { navigate, Paths } from '../../../router/Router';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';

  const controllers = getControllers();
  const makeCodeController = controllers.getMakeCodeController();

  // const renderer = createMakeCodeRenderBlocks({});
  // renderer.initialize();

  onMount(async () => {
    const frameElem = document.getElementById('makecode-elem');
    if (!frameElem) {
      return;
    }

    const onBackButtonPressed = () => navigate(Paths.MODEL);

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

    // Create and initialise an instance of MakeCodeFrameDriver.
    const driverRef = new MakeCodeFrameDriver(
      {
        onBack: onBackButtonPressed,
        controllerId: 'MlMachine',
        initialProjects: async () => [makeCodeController.getMakeCodeProject().get()],
        // When the editor loads, hide the simulator to make more space
        onEditorContentLoaded: e => driverRef.hideSimulator(),
        onWorkspaceSave: e => makeCodeController.setMakeCodeProject(e.project),
        onDownload: e => console.log(e),
        onSave: (file: { name: string; hex: string }) => {
          try {
            FileUtility.downloadFile(file.hex, file.name);
          } catch (err) {
            console.error('Failed to save .hex file', err);
          }
        },
      },
      () => iframe,
    );
    driverRef.initialize();
    driverRef.hideSimulator();
    frameElem.appendChild(iframe);
  });
</script>

<div id="makecode-elem" class="h-[calc(100%-8px)] w-full bg-blue-500" />
