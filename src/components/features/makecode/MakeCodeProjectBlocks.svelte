<!--
  (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->


<script lang="ts">
  import {
    createMakeCodeRenderBlocks,
    type RenderBlocksResponse,
  } from '@microbit/makecode-embed';
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import { onMount } from 'svelte';
  import LoadingSpinner from '../../ui/LoadingSpinner.svelte';
    import { filterSVG } from '../../../lib/MakeCodeBlocks';

  const makeCodeController = getControllers().getMakeCodeController();
  const project = makeCodeController.getMakeCodeProject();

  const blocksRenderer = createMakeCodeRenderBlocks({});
  blocksRenderer.initialize();
  let renderedBlocks: RenderBlocksResponse | null = null;
  let safeSvg: string | null = null;

  onMount(async () => {
    // ensure the renderer is initialized (await in case it's async)
    await blocksRenderer.initialize();
    // project is a Svelte store returned by the controller; use $project to
    // get the current value inside the component.
    renderedBlocks = await blocksRenderer.renderBlocks({ code: $project });
    // Use the shared filterSVG utility to sanitize and scope the SVG.
    safeSvg = filterSVG(renderedBlocks.svg) ?? null;
    console.log(safeSvg);
  });
</script>

{#if safeSvg != null}
  <div>
    {@html safeSvg}
  </div>
{:else}
  <LoadingSpinner />
{/if}
