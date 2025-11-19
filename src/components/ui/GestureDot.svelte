<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getControllers } from '../../backend/interface-adapter/MLMachine';
  import type { GestureID } from '../../core/entities/Gesture';

  let isDotHovered = false;
  export let gestureId: GestureID;
  export let disableTooltip: boolean = false;
  const gestureController = getControllers().getGestureController();
  const gestureState = gestureController.getGestureState(gestureId);

  $: name = $gestureState?.getName();
  $: color = $gestureState?.getColor();
</script>

<div
  class="absolute border-1 border-secondary rounded-md shadow-md bg-white top-[-28px]"
  class:hidden={!isDotHovered || disableTooltip}>
  <p class="px-2">{name}</p>
</div>
<div
  on:mouseenter={() => (isDotHovered = true)}
  on:mouseleave={() => (isDotHovered = false)}
  class="w-3 h-3 z-2 rounded-full"
  style="background-color: {color};" />
