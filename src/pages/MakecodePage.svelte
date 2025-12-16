<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { getControllers } from '../backend/interface-adapter/MLMachine';
  import { navigate, Paths } from '../router/Router';

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
    const iframe = makeCodeController
      .getFrameBuilder()
      .getFrame(onBackButtonPressed)
      .getIframe();

    frameElem.appendChild(iframe);
  });
</script>

<div id="makecode-elem" class="h-[calc(100%-8px)] w-full bg-blue-500" />
