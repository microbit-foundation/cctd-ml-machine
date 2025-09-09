<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import {
    createMakeCodeRenderBlocks,
    createMakeCodeURL,
    MakeCodeFrameDriver,
    type MakeCodeProject,
  } from '@microbit/makecode-embed';
  import { onMount } from 'svelte';
  import { project } from '../lib/makecodeProject';

  const renderer = createMakeCodeRenderBlocks({});
  renderer.initialize();

   onMount(async () => {
     const makecodeElem = document.getElementById('makecode-elem');
     if (!makecodeElem) {
       return;
     }
     const iframe = document.createElement('iframe');
     iframe.allow = 'usb; autoplay; camera; microphone;';
     iframe.src = createMakeCodeURL(
       'https://makecode.microbit.org',
       undefined, // Version.
       undefined, // Language.
       1, // Controller.
       undefined, // Query params.
     );

     iframe.width = '100%';
     iframe.height = '100%';

     makecodeElem.appendChild(iframe);

     // Create and initialise an instance of MakeCodeFrameDriver.
     let driverRef: MakeCodeFrameDriver = null!;
     driverRef = new MakeCodeFrameDriver(
       {
         controllerId: 'YOUR APP NAME HERE',
         initialProjects: async () => [project],
         // When the editor loads, hide the simulator to make more space
         onEditorContentLoaded: e => driverRef.hideSimulator(),
         onBack: () => console.log('Hello!'),
         onWorkspaceSave: e => {
           //console.log(e.project!.header!.id, e.project);
         },
       },
       () => iframe,
     );
     driverRef.initialize();
     driverRef.hideSimulator();
   });
</script>

<div id="makecode-elem" class="h-[calc(100%-8px)] w-full bg-blue-500" />
