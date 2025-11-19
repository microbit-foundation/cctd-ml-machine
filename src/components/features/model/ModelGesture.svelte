<!--
  (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->
<script lang="ts">
  import { getControllers } from '../../../backend/interface-adapter/MLMachine';
  import type { GestureID } from '../../../core/entities/Gesture';
  import Microbits from '../../../lib/microbit-interfacing/Microbits';
  import OutputGestureStack from './ModelGestureStack.svelte';
  import OutputGestureTile from './ModelGestureTile.svelte';

  export let gestureId: GestureID;
  const gestureController = getControllers().getGestureController();
  const gesture = gestureController.getGestureState(gestureId)!;
  let wasTriggered = false;

  $: {
    let isConfident = $gesture.getConfidence().isConfident;
    if (isConfident) {
      if (!wasTriggered) {
        wasTurnedOn();
      }
      wasTriggered = true;
    } else {
      if (wasTriggered) {
        wasTurnedOff();
      }
      wasTriggered = false;
    }
  }
  const wasTurnedOff = () => {};
  const wasTurnedOn = () => {
    if (Microbits.isOutputMakecode()) {
      Microbits.sendUARTGestureMessageToOutput($gesture.getName());
      return;
    }
  };

  export let variant: 'stack' | 'tile';
  export let onUserInteraction: () => void = () => {
    return;
  };
</script>

{#if variant === 'stack'}
  <OutputGestureStack {gestureId} {onUserInteraction} />
{/if}

{#if variant === 'tile'}
  <OutputGestureTile {gestureId} />
{/if}
